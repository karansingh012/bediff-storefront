"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import { useUiStore } from "@/lib/uiStore";

type SortOption = "default" | "price-asc" | "price-desc";

const PRODUCT_FILTERS = [
  { label: "T-Shirts", category: "Tops" },
  { label: "Outerwear", category: "Outerwear" },
  { label: "Shorts", category: "Shorts" },
  { label: "Bottoms", category: "Pants" },
  { label: "Vests", category: "Tops" },
];

const CATEGORY_FILTERS = [
  { label: "Running", category: "Shorts" },
  { label: "Training", category: "Pants" },
  { label: "Lifestyle", category: "Tops" },
];

export default function ShopPage() {
  const activeFilters = useUiStore((state) => state.activeFilters);
  const toggleFilter = useUiStore((state) => state.toggleFilter);
  const clearFilters = useUiStore((state) => state.clearFilters);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const filteredAndSorted = useMemo(() => {
    let result = products.filter((product) => {
      if (activeFilters.categories.length > 0 && !activeFilters.categories.includes(product.category)) {
        return false;
      }
      if (activeFilters.colors.length > 0 && !product.colors.some(c => activeFilters.colors.includes(c))) {
        return false;
      }
      if (activeFilters.sizes.length > 0 && !product.sizes.some(s => activeFilters.sizes.includes(s))) {
        return false;
      }
      return true;
    });

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [activeFilters, sortBy]);

  const itemCount = filteredAndSorted.length;
  const hasActiveFilters = activeFilters.categories.length > 0 || activeFilters.colors.length > 0 || activeFilters.sizes.length > 0;

  return (
    <main>
      {/* ── Collection Hero ── */}
      <section className="relative w-full h-[50vh] min-h-[350px] md:h-[60vh] bg-black overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/products/placeholder.svg"
            alt="BEDIFF Collection"
            fill
            priority
            className="object-cover object-center opacity-70"
          />
        </div>
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-end">
          <div className="flex justify-between items-end p-4 md:p-6 pointer-events-auto w-full max-w-content mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-[0.15em] text-white">
              DELHI
            </h1>
            <button
              type="button"
              onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
              className="text-white text-xs font-medium uppercase tracking-[0.05em] hover:text-gray-300 transition-colors border-b border-transparent hover:border-white pb-1 flex items-center gap-2"
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} />
              FILTER
              {hasActiveFilters && (
                <span className="flex h-4 min-w-4 items-center justify-center bg-white text-black text-[9px] font-bold leading-none px-1">
                  {activeFilters.categories.length + activeFilters.colors.length + activeFilters.sizes.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ── Controls Bar ── */}
      <section className="mx-auto max-w-content px-4 md:px-6">
        <div className="flex items-center justify-between py-6 border-b border-border">
          <div className="flex items-center gap-6">
            {/* SORT button */}
            <button
              type="button"
              onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
              className={`flex items-center gap-2 text-xs font-medium uppercase tracking-[0.05em] transition-colors ${isSortOpen ? "text-gray-500" : "text-black hover:text-gray-500"}`}
            >
              SORT
              <ChevronDown size={12} strokeWidth={1.5} className={`transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          <span className="text-xs uppercase tracking-[0.05em] font-medium text-gray-400">
            {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}
          </span>
        </div>

        {/* ── Filter Panel ── */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-b border-border"
            >
              <div className="py-8 flex flex-col md:flex-row gap-10">
                {/* Product Type */}
                <div className="flex flex-col gap-4 min-w-[140px]">
                  <h4 className="text-[10px] font-medium uppercase tracking-[0.05em] text-gray-400">Product</h4>
                  {PRODUCT_FILTERS.map((f) => (
                    <button
                      key={f.label}
                      onClick={() => toggleFilter("categories", f.category)}
                      className={`text-left text-sm uppercase tracking-[0.05em] font-medium transition-colors ${activeFilters.categories.includes(f.category) ? "text-black" : "text-gray-400 hover:text-black"}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Category */}
                <div className="flex flex-col gap-4 min-w-[140px]">
                  <h4 className="text-[10px] font-medium uppercase tracking-[0.05em] text-gray-400">Category</h4>
                  {CATEGORY_FILTERS.map((f) => (
                    <button
                      key={f.label}
                      onClick={() => toggleFilter("categories", f.category)}
                      className={`text-left text-sm uppercase tracking-[0.05em] font-medium transition-colors ${activeFilters.categories.includes(f.category) ? "text-black" : "text-gray-400 hover:text-black"}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Color */}
                <div className="flex flex-col gap-4 min-w-[140px]">
                  <h4 className="text-[10px] font-medium uppercase tracking-[0.05em] text-gray-400">Color</h4>
                  {["Black", "White"].map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleFilter("colors", color)}
                      className={`text-left text-sm uppercase tracking-[0.05em] font-medium transition-colors ${activeFilters.colors.includes(color) ? "text-black" : "text-gray-400 hover:text-black"}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>

                {/* Size */}
                <div className="flex flex-col gap-4 min-w-[140px]">
                  <h4 className="text-[10px] font-medium uppercase tracking-[0.05em] text-gray-400">Size</h4>
                  {["XS", "S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleFilter("sizes", size)}
                      className={`text-left text-sm uppercase tracking-[0.05em] font-medium transition-colors ${activeFilters.sizes.includes(size) ? "text-black" : "text-gray-400 hover:text-black"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Clear */}
                {hasActiveFilters && (
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 text-xs font-medium uppercase tracking-[0.05em] text-gray-400 hover:text-black transition-colors"
                    >
                      <X size={12} strokeWidth={1.5} />
                      CLEAR ALL
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Sort Panel ── */}
        <AnimatePresence>
          {isSortOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-b border-border"
            >
              <div className="py-6 flex flex-col gap-4">
                {([
                  { value: "default", label: "DEFAULT" },
                  { value: "price-asc", label: "PRICE: LOW TO HIGH" },
                  { value: "price-desc", label: "PRICE: HIGH TO LOW" },
                ] as { value: SortOption; label: string }[]).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                    className={`text-left text-sm uppercase tracking-[0.05em] font-medium transition-colors ${sortBy === opt.value ? "text-black" : "text-gray-400 hover:text-black"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Product Grid ── */}
      <section className="mx-auto max-w-content px-4 md:px-6 py-12 md:py-16">
        {itemCount > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-16">
            {filteredAndSorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="text-sm text-gray-500 uppercase tracking-[0.05em]">NO PRODUCTS FOUND</span>
            <button
              onClick={clearFilters}
              className="text-xs font-medium uppercase tracking-[0.05em] text-black border-b border-black pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors"
            >
              CLEAR FILTERS
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
