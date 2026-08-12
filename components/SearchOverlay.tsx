"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { useUiStore } from "@/lib/uiStore";
import { products } from "@/lib/products";

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUiStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) closeSearch();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  const results = query
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          className="fixed inset-0 z-[60] bg-white flex flex-col"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Search Header */}
          <div className="flex h-[68px] items-center justify-between px-4 md:px-6 border-b border-border">
            <div className="flex-1 flex items-center gap-4">
              <Search size={20} strokeWidth={1.5} className="text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="SEARCH BEDIFF..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm md:text-base font-medium uppercase tracking-[0.05em] text-black placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={closeSearch}
              className="flex h-10 w-10 items-center justify-center shrink-0"
              aria-label="Close search"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-8">
            {query && results.length === 0 && (
              <div className="text-center text-gray-500 uppercase tracking-[0.05em] text-sm mt-8">
                NO RESULTS FOUND FOR &quot;{query}&quot;
              </div>
            )}
            
            {results.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 max-w-content mx-auto">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={closeSearch}
                    className="group flex flex-col"
                  >
                    <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden border border-border">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4 flex flex-col items-center text-center space-y-1">
                      <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.05em] text-black">
                        {product.name}
                      </h3>
                      <p className="text-[10px] md:text-xs text-gray-500 font-medium">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
