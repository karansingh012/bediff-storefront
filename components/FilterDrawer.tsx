"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useUiStore, FilterState } from "@/lib/uiStore";
import { products } from "@/lib/products";

// Derive available filter options from products
const availableCategories = Array.from(new Set(products.map((p) => p.category)));
const availableColors = Array.from(new Set(products.flatMap((p) => p.colors)));
const availableSizes = Array.from(new Set(products.flatMap((p) => p.sizes)));

interface FilterSectionProps {
  title: string;
  options: string[];
  type: keyof FilterState;
}

function FilterSection({ title, options, type }: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const activeFilters = useUiStore((state) => state.activeFilters[type]);
  const toggleFilter = useUiStore((state) => state.toggleFilter);

  return (
    <div className="border-b border-border py-4">
      <button
        type="button"
        className="w-full flex justify-between items-center text-xs font-medium uppercase tracking-[0.05em] text-black py-2"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span>{title}</span>
        {isExpanded ? <ChevronUp size={16} strokeWidth={1.5} /> : <ChevronDown size={16} strokeWidth={1.5} />}
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 pt-2 pb-2">
              {options.map((option) => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 border border-border group-hover:border-black transition-colors">
                    {activeFilters.includes(option) && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2.5 h-2.5 bg-black" 
                      />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={activeFilters.includes(option)}
                    onChange={() => toggleFilter(type, option)}
                  />
                  <span className="text-sm text-gray-500 group-hover:text-black transition-colors uppercase tracking-[0.05em] text-[11px]">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FilterDrawer() {
  const { isFilterOpen, closeFilter, clearFilters } = useUiStore();

  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFilterOpen) closeFilter();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFilterOpen, closeFilter]);

  return (
    <AnimatePresence>
      {isFilterOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/20"
            onClick={closeFilter}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 right-0 z-50 w-full md:w-[400px] bg-white border-l border-border flex flex-col shadow-none"
            role="dialog"
            aria-modal="true"
            aria-label="Filter products"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-[68px] px-6 border-b border-border shrink-0">
              <span className="text-xs font-bold uppercase tracking-[0.1em] text-black">
                FILTER
              </span>
              <button
                type="button"
                onClick={closeFilter}
                className="text-gray-500 hover:text-black transition-colors"
                aria-label="Close filters"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <FilterSection title="Product" options={availableCategories} type="categories" />
              <FilterSection title="Color" options={availableColors} type="colors" />
              <FilterSection title="Size" options={availableSizes} type="sizes" />
              
              {/* Placeholders for requested fields not fully driven by current minimal mock data */}
              <div className="border-b border-border py-4 opacity-50 cursor-not-allowed">
                 <span className="block text-xs font-medium uppercase tracking-[0.05em] text-black py-2">Collection (N/A)</span>
              </div>
              <div className="border-b border-border py-4 opacity-50 cursor-not-allowed">
                 <span className="block text-xs font-medium uppercase tracking-[0.05em] text-black py-2">Availability (N/A)</span>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="p-6 border-t border-border bg-white flex gap-4 shrink-0">
              <button
                type="button"
                onClick={clearFilters}
                className="w-full py-3 border border-border text-xs font-medium uppercase tracking-[0.05em] text-black hover:border-black transition-colors rounded-none"
              >
                CLEAR
              </button>
              <button
                type="button"
                onClick={closeFilter}
                className="w-full py-3 bg-black text-white text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-800 transition-colors rounded-none"
              >
                APPLY
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
