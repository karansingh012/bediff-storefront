import { NextResponse } from "next/server";
import { cashfree } from "@/lib/cashfree";
import { products } from "@/lib/products";
import type { CartItem } from "@/types/product";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer } = body as { items: CartItem[], customer: any };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or invalid" },
        { status: 400 }
      );
    }

    if (!customer || !customer.email || !customer.fullName || !customer.phone || !customer.address1 || !customer.city || !customer.state || !customer.pinCode) {
      return NextResponse.json(
        { error: "Customer information is incomplete" },
        { status: 400 }
      );
    }

    // Server-side validation for customer
    if (!/^\S+@\S+\.\S+$/.test(customer.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    if (!/^[6-9]\d{9}$/.test(customer.phone)) {
      return NextResponse.json({ error: "Invalid phone format" }, { status: 400 });
    }
    if (!/^\d{6}$/.test(customer.pinCode)) {
      return NextResponse.json({ error: "Invalid PIN format" }, { status: 400 });
    }

    let orderAmount = 0;

    // Validate each item against our trusted product catalog
    for (const item of items) {
      const product = products.find((p) => p.id === item.id);

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.id}` },
          { status: 400 }
        );
      }

      // Basic validation
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          { error: `Invalid quantity for product: ${product.name}` },
          { status: 400 }
        );
      }

      if (item.quantity > 10) {
        return NextResponse.json(
          { error: `Quantity too high for product: ${product.name}` },
          { status: 400 }
        );
      }

      if (product.sizes && product.sizes.length > 0) {
        if (!item.selectedSize || !product.sizes.includes(item.selectedSize)) {
          return NextResponse.json(
            { error: `Invalid size for product: ${product.name}` },
            { status: 400 }
          );
        }
      }

      if (product.colors && product.colors.length > 0) {
        if (!item.selectedColor || !product.colors.includes(item.selectedColor)) {
          return NextResponse.json(
            { error: `Invalid color for product: ${product.name}` },
            { status: 400 }
          );
        }
      }

      orderAmount += product.price * item.quantity;
    }

    const shipping = 0; // Free shipping placeholder
    const grandTotal = orderAmount + shipping;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const orderId = `BEDIFF_${crypto.randomUUID().replace(/-/g, "")}`;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Create order in DB
    const orderData = {
      user_id: user?.id || null,
      order_number: orderId,
      status: 'PENDING',
      payment_status: 'PENDING',
      payment_provider: 'CASHFREE',
      subtotal: orderAmount,
      shipping_amount: shipping,
      total_amount: grandTotal,
      currency: 'INR',
      shipping_name: customer.fullName,
      shipping_phone: customer.phone,
      shipping_address_line_1: customer.address1,
      shipping_address_line_2: customer.address2 || null,
      shipping_city: customer.city,
      shipping_state: customer.state,
      shipping_postal_code: customer.pinCode,
      shipping_country: customer.country,
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order creation failed:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    const orderItems = items.map(item => {
      const product = products.find((p) => p.id === item.id)!;
      return {
        order_id: order.id,
        product_id: item.id,
        product_name: product.name,
        product_slug: product.slug,
        size: item.selectedSize || null,
        color: item.selectedColor || null,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: product.price * item.quantity,
        image: item.images[0] || null,
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items creation failed:", itemsError);
      return NextResponse.json(
        { error: "Failed to save order items" },
        { status: 500 }
      );
    }

    // Create Cashfree Order
    const requestObject = {
      order_amount: grandTotal,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: user ? user.id : `CUST_${crypto.randomUUID().split("-")[0]}`,
        customer_email: customer.email,
        customer_phone: customer.phone,
        customer_name: customer.fullName,
      },
      order_meta: {
        return_url: `${baseUrl}/checkout/success?order_id=${orderId}`,
      },
    };

    const response = await cashfree.PGCreateOrder(requestObject);
    
    // Return payment session ID to frontend
    return NextResponse.json({ 
      payment_session_id: response.data.payment_session_id,
      order_id: orderId
    });
  } catch (error: any) {
    console.error("Checkout API Error:", error?.response?.data || error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
