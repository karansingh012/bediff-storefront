"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTotalQuantity, useCartStore } from "@/lib/cartStore";
import { useUiStore } from "@/lib/uiStore";

const NAV_LINKS = [
  { label: "COLLECTION", href: "#" },
  { label: "SHOP", href: "#" },
  { label: "BRAND", href: "#" },
  { label: "INFO", href: "#" },
] as const;

function CartBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center bg-black text-white text-[9px] font-medium leading-none px-1">
      {count}
    </span>
  );
}

export default function Header() {
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useUiStore();
  const openCart = useCartStore((state) => state.openCart);
  const totalQuantity = useTotalQuantity();

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, closeMobileMenu]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-border">
        <div className="mx-auto flex h-[68px] max-w-content items-center justify-between px-4 md:px-6">
          {/* ───────── LEFT: Desktop nav links / Mobile hamburger ───────── */}
          <div className="flex items-center gap-7 md:w-1/3">
            <button
              type="button"
              className="md:hidden flex items-center justify-center"
              onClick={openMobileMenu}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-medium uppercase tracking-[0.05em] text-black hover:text-gray-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ───────── CENTER: Wordmark ───────── */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-base md:text-lg font-bold uppercase tracking-[0.18em] text-black"
            aria-label="BEDIFF Home"
          >
            BEDIFF
          </Link>

          {/* ───────── RIGHT: Desktop action links / Mobile cart icon ───────── */}
          <div className="flex items-center justify-end gap-7 md:w-1/3">
            <Link
              href="#"
              onClick={(e) => e.preventDefault()}
              className="hidden md:inline-block text-xs font-medium uppercase tracking-[0.05em] text-black hover:text-gray-500 transition-colors"
            >
              SEARCH
            </Link>
            <Link
              href="#"
              onClick={(e) => e.preventDefault()}
              className="hidden md:inline-block text-xs font-medium uppercase tracking-[0.05em] text-black hover:text-gray-500 transition-colors"
            >
              ACCOUNT
            </Link>

            <button 
              type="button"
              className="relative flex items-center" 
              aria-label="Shopping cart"
              onClick={openCart}
            >
              <span className="hidden md:inline text-xs font-medium uppercase tracking-[0.05em] text-black hover:text-gray-500 transition-colors pr-1">
                CART
              </span>
              <ShoppingBag className="md:hidden" size={20} strokeWidth={1.5} />
              <CartBadge count={totalQuantity} />
            </button>

            <span className="hidden md:inline text-xs font-medium uppercase tracking-[0.05em] text-gray-400">
              INDIA
            </span>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-white md:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex h-[68px] items-center justify-between px-4 border-b border-transparent">
              <button
                type="button"
                className="flex items-center justify-center"
                onClick={closeMobileMenu}
                aria-label="Close navigation menu"
              >
                <X size={22} strokeWidth={1.5} />
              </button>

              <Link
                href="/"
                className="absolute left-1/2 -translate-x-1/2 text-base font-bold uppercase tracking-[0.18em] text-black"
                onClick={closeMobileMenu}
                aria-label="BEDIFF Home"
              >
                BEDIFF
              </Link>

              <button
                type="button"
                className="relative flex items-center justify-center"
                aria-label="Shopping cart"
                onClick={() => {
                  closeMobileMenu();
                  openCart();
                }}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                <CartBadge count={totalQuantity} />
              </button>
            </div>

            <nav className="flex flex-col gap-8 px-6 pt-10" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-2xl font-medium uppercase tracking-[0.08em] text-black"
                  onClick={(e) => {
                    e.preventDefault();
                    closeMobileMenu();
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-6 px-6 pt-12 border-t border-border mt-12">
              <Link
                href="#"
                className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.05em] text-black pt-6"
                onClick={(e) => {
                  e.preventDefault();
                  closeMobileMenu();
                }}
              >
                <Search size={18} strokeWidth={1.5} />
                SEARCH
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.05em] text-black"
                onClick={(e) => {
                  e.preventDefault();
                  closeMobileMenu();
                }}
              >
                <User size={18} strokeWidth={1.5} />
                ACCOUNT
              </Link>
              <div className="pt-6 mt-6 border-t border-border">
                <span className="text-sm font-medium uppercase tracking-[0.05em] text-gray-400">
                  INDIA
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

