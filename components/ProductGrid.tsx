"use client";

import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import { useUiStore } from "@/lib/uiStore";

interface ProductGridProps {
  className?: string;
}

export default function ProductGrid({ className = "" }: ProductGridProps) {
  const activeFilters = useUiStore((state) => state.activeFilters);

  // Apply filters
  const filteredProducts = products.filter((product) => {
    // Category match
    if (activeFilters.categories.length > 0 && !activeFilters.categories.includes(product.category)) {
      return false;
    }
    // Color match (product must have at least one of the selected colors)
    if (activeFilters.colors.length > 0 && !product.colors.some(c => activeFilters.colors.includes(c))) {
      return false;
    }
    // Size match (product must have at least one of the selected sizes)
    if (activeFilters.sizes.length > 0 && !product.sizes.some(s => activeFilters.sizes.includes(s))) {
      return false;
    }
    return true;
  });

  const itemCount = filteredProducts.length;

  return (
    <section className={`mx-auto max-w-content px-4 md:px-6 py-18 md:py-22 ${className}`}>
      {/* Grid Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xs uppercase tracking-[0.05em] font-medium text-black">
          PRODUCTS / ALL
        </h2>
        <span className="text-xs uppercase tracking-[0.05em] font-medium text-gray-400">
          {itemCount} ITEMS
        </span>
      </div>

      {/* Grid */}
      {itemCount > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-16">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center py-20">
          <span className="text-sm text-gray-500 uppercase tracking-[0.05em]">NO PRODUCTS FOUND</span>
        </div>
      )}
    </section>
  );
}

