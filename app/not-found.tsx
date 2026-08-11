import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-white">
      <div className="flex flex-col items-center text-center space-y-6">
        <SearchX size={48} strokeWidth={1} className="text-black" />
        
        <div className="space-y-2">
          <h1 className="text-2xl font-medium tracking-[0.1em] uppercase text-black">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-[0.05em]">
            The page you're looking for doesn't exist.
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 px-8 py-4 bg-black text-white text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-800 transition-colors inline-block"
        >
          BACK TO SHOP
        </Link>
      </div>
    </div>
  );
}
