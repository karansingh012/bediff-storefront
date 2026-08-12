import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateString));
}

// Since Next.js 16/15 requires params to be awaited in dynamic routes
export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login");
  }

  // Fetch order
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!order || order.user_id !== user.id) {
    notFound();
  }

  // Fetch order items
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);

  return (
    <div className="max-w-content mx-auto px-4 py-12 md:py-16">
      
      <div className="mb-8">
        <Link 
          href="/account/orders" 
          className="text-xs font-bold uppercase tracking-[0.05em] text-gray-500 hover:text-black transition-colors"
        >
          ← BACK TO ORDERS
        </Link>
      </div>

      <div className="mb-12 border-b border-border pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-[0.1em] text-black">
            ORDER #{order.order_number}
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-[0.05em] mt-2">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        
        <div className="flex gap-8">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-[0.05em]">Payment</p>
            <p className={`text-sm font-bold mt-1 ${order.payment_status === 'PAID' ? 'text-green-600' : 'text-orange-500'}`}>
              {order.payment_status}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-[0.05em]">Order</p>
            <p className="text-sm font-bold text-black mt-1">
              {order.status}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-black border-b border-border pb-2">
            ITEMS
          </h2>
          
          <div className="flex flex-col gap-6">
            {items?.map((item) => (
              <div key={item.id} className="flex gap-6">
                <Link href={`/product/${item.product_slug}`} className="relative w-24 h-32 bg-gray-50 border border-border shrink-0 block hover:opacity-80 transition-opacity">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  )}
                </Link>
                
                <div className="flex flex-col justify-center flex-1">
                  <Link href={`/product/${item.product_slug}`} className="text-sm font-bold uppercase tracking-[0.05em] text-black hover:text-gray-500 transition-colors">
                    {item.product_name}
                  </Link>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-[0.05em]">
                    {item.color} / {item.size}
                  </p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-xs text-gray-500 uppercase tracking-[0.05em]">
                      QTY: {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-black">
                      {formatPrice(item.total_price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="flex flex-col gap-12">
          
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-black mb-6 pb-2 border-b border-border">
              SUMMARY
            </h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 uppercase tracking-[0.05em]">Subtotal</span>
                <span className="text-black font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 uppercase tracking-[0.05em]">Shipping</span>
                <span className="text-black font-medium">{order.shipping_amount === 0 ? "FREE" : formatPrice(order.shipping_amount)}</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="text-sm font-bold uppercase tracking-[0.05em] text-black">Total</span>
                <span className="text-lg font-bold text-black">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-black mb-6 pb-2 border-b border-border">
              SHIPPING ADDRESS
            </h2>
            
            <div className="bg-gray-50 p-6 border border-border text-sm leading-relaxed">
              <p className="font-bold text-black">{order.shipping_name}</p>
              <p className="text-gray-600 mt-2">{order.shipping_address_line_1}</p>
              {order.shipping_address_line_2 && (
                <p className="text-gray-600">{order.shipping_address_line_2}</p>
              )}
              <p className="text-gray-600">{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
              <p className="text-gray-600 uppercase tracking-[0.05em] mt-2">{order.shipping_country}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-600">Ph: {order.shipping_phone}</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
