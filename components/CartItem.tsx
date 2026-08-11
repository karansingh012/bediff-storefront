"use client";

import Image from "next/image";
import { Plus, Minus, X } from "lucide-react";
import type { CartItem as CartItemType } from "@/types/product";
import { useCartStore } from "@/lib/cartStore";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQty, removeItem } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleIncrease = () => {
    updateQty(item.id, item.selectedColor, item.selectedSize, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQty(item.id, item.selectedColor, item.selectedSize, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(item.id, item.selectedColor, item.selectedSize);
  };

  return (
    <div className="flex gap-4 py-6 border-b border-border relative">
      <div className="relative w-24 aspect-[3/4] bg-[#F9F9F9] shrink-0">
        {item.images[0] && (
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            sizes="96px"
            className="object-cover object-center"
          />
        )}
      </div>

      <div className="flex flex-col flex-1 justify-between">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-[0.05em] text-black pr-6">
              {item.name}
            </span>
            <span className="text-[11px] text-gray-500 uppercase tracking-[0.05em] mt-1">
              COLOR: {item.selectedColor}
            </span>
            {item.selectedSize && (
              <span className="text-[11px] text-gray-500 uppercase tracking-[0.05em] mt-0.5">
                SIZE: {item.selectedSize}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-gray-400 hover:text-black transition-colors shrink-0 absolute top-6 right-0"
            aria-label="Remove item"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-end justify-between mt-4">
          <div className="flex items-center border border-border h-8">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="w-8 h-full flex items-center justify-center text-black disabled:text-gray-300 hover:bg-gray-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={12} strokeWidth={1.5} />
            </button>
            <span className="w-8 text-center text-xs text-black font-medium">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              className="w-8 h-full flex items-center justify-center text-black hover:bg-gray-50 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={12} strokeWidth={1.5} />
            </button>
          </div>
          <span className="text-xs text-black">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

