"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock } from "lucide-react";
import { useCartStore, useSubtotal, useTotalQuantity } from "@/lib/cartStore";
import CartItem from "./CartItem";

export default function CartDrawer() {
  const { isCartOpen, closeCart, cart } = useCartStore();
  const subtotal = useSubtotal();
  const totalQuantity = useTotalQuantity();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) closeCart();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cart }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(error instanceof Error ? error.message : "An error occurred during checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop (hidden on mobile, visible on desktop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/20 hidden md:block"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer Panel (full width on mobile, 450px on desktop) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-white border-l border-border flex flex-col shadow-none"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-[68px] px-6 border-b border-border shrink-0">
              <span className="text-xs font-bold uppercase tracking-[0.1em] text-black">
                CART ({totalQuantity})
              </span>
              <button
                type="button"
                onClick={closeCart}
                className="text-gray-500 hover:text-black transition-colors"
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Scrollable Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-6">
                  <span className="text-sm text-gray-400 uppercase tracking-[0.05em]">
                    YOUR CART IS EMPTY
                  </span>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="px-8 py-3 bg-black text-white text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-800 transition-colors rounded-none"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <div className="flex flex-col">
                  {cart.map((item) => (
                    <CartItem key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Actions */}
            {cart.length > 0 && (
              <div className="border-t border-border bg-white shrink-0">
                <div className="p-6 pb-4 flex justify-between items-center">
                  <span className="text-xs font-medium uppercase tracking-[0.05em] text-black">
                    SUBTOTAL
                  </span>
                  <span className="text-sm text-black">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="px-6 pb-4">
                  <span className="text-[10px] text-gray-500 uppercase tracking-[0.05em]">
                    SHIPPING & TAXES CALCULATED AT CHECKOUT
                  </span>
                </div>
                <div className="p-6 pt-2 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={checkoutLoading || cart.length === 0}
                    className="w-full py-4 bg-black text-white text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-800 transition-colors rounded-none disabled:bg-gray-300 flex justify-center items-center gap-2"
                  >
                    <Lock size={14} strokeWidth={1.5} />
                    {checkoutLoading ? "PROCESSING..." : "CHECKOUT"}
                  </button>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="w-full py-4 bg-white border border-black text-black text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-50 transition-colors rounded-none"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

