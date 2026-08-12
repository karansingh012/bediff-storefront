"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  
  const [orderDetails, setOrderDetails] = useState<{ amount: number; email: string } | null>(null);

  // Isolated behavior: clear cart securely on client-side after successful payment verification.
  // In Phase 5, this will be replaced by a database-backed order system.
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }

    let isMounted = true;

    const verifyOrder = async () => {
      try {
        const res = await fetch(`/api/cashfree/order-status?order_id=${orderId}`);
        const data = await res.json();
        
        if (!isMounted) return;

        if (data.order_status === "PAID") {
          setStatus("success");
          setOrderDetails({
            amount: data.order_amount,
            email: data.customer_email || "Customer",
          });
          clearCart();
        } else {
          setStatus("failed");
        }
      } catch (err) {
        if (isMounted) {
          setStatus("failed");
        }
      }
    };

    verifyOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, clearCart]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center text-center space-y-6">
          <Loader2 size={48} strokeWidth={1} className="text-black animate-spin" />
          <div className="space-y-2">
            <h1 className="text-2xl font-medium tracking-[0.1em] uppercase text-black">
              Verifying Payment
            </h1>
            <p className="text-sm text-gray-500 uppercase tracking-[0.05em]">
              Please do not refresh the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center text-center space-y-6">
          <XCircle size={48} strokeWidth={1} className="text-black" />
          <div className="space-y-2">
            <h1 className="text-2xl font-medium tracking-[0.1em] uppercase text-black">
              Payment Incomplete
            </h1>
            <p className="text-sm text-gray-500 uppercase tracking-[0.05em]">
              We could not verify a successful payment for this order.
            </p>
          </div>
          <Link
            href="/checkout"
            className="mt-8 px-8 py-4 bg-black text-white text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-800 transition-colors inline-block"
          >
            RETURN TO CHECKOUT
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center text-center space-y-6">
        <CheckCircle size={48} strokeWidth={1} className="text-black" />
        
        <div className="space-y-2">
          <h1 className="text-2xl font-medium tracking-[0.1em] uppercase text-black">
            Order Confirmed
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-[0.05em]">
            Thank you for shopping with BEDIFF.
          </p>
          {orderId && orderDetails && (
             <div className="flex flex-col items-center gap-2 mt-6 p-6 border border-border bg-gray-50">
               <p className="text-xs text-black uppercase tracking-[0.05em]">
                 Order ID: <span className="font-bold">{orderId}</span>
               </p>
               <p className="text-xs text-black uppercase tracking-[0.05em]">
                 Amount: <span className="font-bold">{formatPrice(orderDetails.amount)}</span>
               </p>
               <p className="text-xs text-black uppercase tracking-[0.05em] mt-2 text-gray-500">
                 Confirmation sent to {orderDetails.email}
               </p>
             </div>
          )}
        </div>

        <Link
          href="/"
          className="mt-8 px-8 py-4 bg-black text-white text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-800 transition-colors inline-block"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <Loader2 size={48} strokeWidth={1} className="text-black animate-spin" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
