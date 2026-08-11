"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { useCartStore } from "@/lib/cartStore";
import Gallery from "@/components/Gallery";
import SizeSelector from "@/components/SizeSelector";
import ColorDots from "@/components/ColorDots";
import AccordionItem from "@/components/AccordionItem";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const addItem = useCartStore((state) => state.addItem);

  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [error, setError] = useState<string>("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setError("PLEASE SELECT A SIZE");
      return;
    }
    setError("");
    addItem({
      product,
      selectedColor,
      selectedSize,
    });
  };

  const handleBuyNow = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setError("PLEASE SELECT A SIZE");
      return;
    }
    setError("");
    addItem({
      product,
      selectedColor,
      selectedSize,
    });
    // For Phase 2, we just log and stop. Checkout routing will be added in Phase 3.
    console.log("Proceeding to checkout with", product.name);
  };

  return (
    <div className="mx-auto max-w-content px-4 md:px-6 mb-24 md:mb-32">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left: Gallery */}
        <div className="w-full md:w-[60%]">
          <Gallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-[40%] flex flex-col pt-4 md:pt-0">
          <div className="text-[10px] uppercase tracking-[0.1em] text-gray-400 mb-4">
            HOME / {product.category}
          </div>
          <h1 className="text-xl md:text-2xl uppercase tracking-[0.05em] font-medium text-black">
            {product.name}
          </h1>
          <div className="text-sm text-gray-500 mt-3">{formatPrice(product.price)}</div>

          <div className="mt-10">
            <div className="text-xs uppercase tracking-[0.05em] font-medium text-black mb-3">
              COLOR: <span className="text-gray-500">{selectedColor}</span>
            </div>
            <ColorDots
              colors={product.colors}
              selectedColor={selectedColor}
              onSelect={setSelectedColor}
              className="!mt-0"
            />
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-[0.05em] font-medium text-black">
                SIZE
              </span>
              <button
                type="button"
                className="text-[10px] uppercase tracking-[0.05em] text-gray-500 hover:text-black underline underline-offset-4"
              >
                SIZE GUIDE
              </button>
            </div>
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelect={(size) => {
                setSelectedSize(size);
                setError("");
              }}
            />
            {error && <div className="text-red-500 text-xs mt-3 uppercase tracking-[0.05em]">{error}</div>}
          </div>

          <div className="mt-12 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-4 bg-black text-white text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-800 transition-colors rounded-none"
            >
              ADD TO CART
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-4 bg-white border border-black text-black text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-50 transition-colors rounded-none"
            >
              BUY NOW
            </button>
          </div>

          <div className="mt-16 border-t border-border">
            <AccordionItem title="DETAILS" defaultOpen>
              <p>Premium lightweight construction designed for ultimate performance and mobility.</p>
            </AccordionItem>
            <AccordionItem title="MATERIAL">
              <p>100% Technical Polyester blend. Sourced from Japan.</p>
            </AccordionItem>
            <AccordionItem title="FIT & SIZE">
              <p>True to size. Model is 6&apos;1&quot; and wears size Medium.</p>
            </AccordionItem>
            <AccordionItem title="CARE">
              <p>Machine wash cold. Do not tumble dry. Do not iron print.</p>
            </AccordionItem>
            <AccordionItem title="SHIPPING & RETURNS">
              <p>Free standard shipping on orders over ₹10,000. 30-day return policy for unworn items.</p>
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
  );
}
