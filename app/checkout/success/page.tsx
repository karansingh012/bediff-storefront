import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
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
