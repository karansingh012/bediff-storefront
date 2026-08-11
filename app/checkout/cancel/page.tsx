import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center text-center space-y-6">
        <XCircle size={48} strokeWidth={1} className="text-black" />
        
        <div className="space-y-2">
          <h1 className="text-2xl font-medium tracking-[0.1em] uppercase text-black">
            Checkout Cancelled
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-[0.05em]">
            Your cart has been saved.
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 px-8 py-4 bg-white border border-black text-black text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-50 transition-colors inline-block"
        >
          RETURN TO CART
        </Link>
      </div>
    </div>
  );
}
