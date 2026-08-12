"use client";

import Image from "next/image";
import { useUiStore } from "@/lib/uiStore";

export default function CollectionHero() {
  const openFilter = useUiStore((state) => state.openFilter);

  return (
    <section className="relative w-full h-[60vh] min-h-[400px] bg-black overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/products/placeholder.svg"
          alt="Collection"
          fill
          priority
          className="object-cover object-center opacity-80"
        />
      </div>
      
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-end">
        <div className="flex justify-between items-end p-4 md:p-6 pointer-events-auto w-full max-w-content mx-auto">
          <h1 className="text-white text-3xl md:text-5xl font-bold uppercase tracking-[0.1em]">
            SUMMER 26
          </h1>
          <button
            type="button"
            onClick={openFilter}
            className="text-white text-xs font-medium uppercase tracking-[0.05em] hover:text-gray-300 transition-colors border-b border-transparent hover:border-white pb-1"
            aria-label="Open filters"
          >
            FILTER
          </button>
        </div>
      </div>
    </section>
  );
}
