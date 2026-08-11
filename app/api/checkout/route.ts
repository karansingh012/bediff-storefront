import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { products } from "@/lib/products";
import type { CartItem } from "@/types/product";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body as { items: CartItem[] };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or invalid" },
        { status: 400 }
      );
    }

    const lineItems: any[] = [];

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

      // Construct Stripe line item using trusted server-side price
      lineItems.push({
        price_data: {
          currency: "inr", // Assuming INR based on user prompt
          product_data: {
            name: product.name,
            description: `Color: ${item.selectedColor}${
              item.selectedSize ? ` | Size: ${item.selectedSize}` : ""
            }`,
          },
          unit_amount: product.price * 100, // Stripe expects amounts in cents/paise
        },
        quantity: item.quantity,
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: {
        // Here we could store a generic order reference
        // order_id: generateOrderId(),
        cart_summary: items.map((i) => `${i.id}(${i.quantity})`).join(", "),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
