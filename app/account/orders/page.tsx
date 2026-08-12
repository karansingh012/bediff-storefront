import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

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

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login");
  }

  // Fetch orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-content mx-auto px-4 py-12 md:py-16">
      <div className="mb-12">
        <h1 className="text-2xl font-bold uppercase tracking-[0.1em] text-black">
          MY ORDERS
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-4">
          <Link 
            href="/account/orders" 
            className="text-xs font-bold uppercase tracking-[0.05em] text-gray-400 cursor-default"
          >
            MY ORDERS
          </Link>
          <Link 
            href="/account" 
            className="text-xs font-bold uppercase tracking-[0.05em] text-black hover:text-gray-500 transition-colors"
          >
            ACCOUNT DETAILS
          </Link>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2">
          {(!orders || orders.length === 0) ? (
            <div className="text-center py-12 border border-border bg-gray-50">
              <p className="text-sm text-gray-500 uppercase tracking-[0.05em] mb-6">
                You haven't placed any orders yet.
              </p>
              <Link 
                href="/products" 
                className="inline-block px-8 py-4 bg-black text-white text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-800 transition-colors"
              >
                SHOP NOW
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <Link 
                  key={order.id} 
                  href={`/account/orders/${order.id}`}
                  className="block p-6 border border-border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.05em] text-black">
                        ORDER #{order.order_number}
                      </p>
                      <p className="text-xs text-gray-500 uppercase tracking-[0.05em] mt-1">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    
                    <div className="flex gap-6 items-center">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-[0.05em]">Status</p>
                        <p className={`text-sm font-bold mt-1 ${order.payment_status === 'PAID' ? 'text-green-600' : 'text-orange-500'}`}>
                          {order.payment_status}
                        </p>
                      </div>
                      
                      <div className="text-left md:text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-[0.05em]">Total</p>
                        <p className="text-sm font-bold text-black mt-1">
                          {formatPrice(order.total_amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
