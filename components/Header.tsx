"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTotalQuantity } from "@/lib/cartStore";

// ---------------------------------------------------------------------------
// NAV LINKS — single source of truth for both desktop and mobile menus.
// Add, reorder, or remove links here; JSX maps over this array.
// ---------------------------------------------------------------------------
const NAV_LINKS = [
  { label: "COLLECTION", href: "/collection" },
  { label: "SHOP", href: "/shop" },
  { label: "BRAND", href: "/brand" },
  { label: "INFO", href: "/info" },
] as const;

// ---------------------------------------------------------------------------
// CART BADGE — small numeric indicator, only rendered when count > 0.
// ---------------------------------------------------------------------------
function CartBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center bg-black text-white text-[9px] font-medium leading-none px-1">
      {count}
    </span>
  );
}

// ---------------------------------------------------------------------------
// HEADER
// Desktop: full nav bar with left links · centered wordmark · right actions.
// Mobile:  hamburger + wordmark + cart icon; hamburger opens full-screen menu.
// ---------------------------------------------------------------------------
export default function Header() {
  // Mobile menu open/close state — only used below md breakpoint
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalQuantity = useTotalQuantity();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
        <div className="mx-auto flex h-[68px] max-w-content items-center justify-between px-4 md:px-6">
          {/* ───────── LEFT: Desktop nav links / Mobile hamburger ───────── */}
          <div className="flex items-center gap-7 md:w-1/3">
            {/* Hamburger — visible only on mobile (below md) */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            {/* Desktop nav links — hidden on mobile */}
            <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.05em] text-black hover:text-gray-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ───────── CENTER: Wordmark — absolutely positioned so it stays
               centred regardless of left/right content width ───────── */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-base md:text-lg font-bold uppercase tracking-[0.18em] text-black"
          >
            BEDIFF
          </Link>

          {/* ───────── RIGHT: Desktop action links / Mobile cart icon ───────── */}
          <div className="flex items-center justify-end gap-7 md:w-1/3">
            {/* Desktop-only action links */}
            <Link
              href="/search"
              className="hidden md:inline-block text-xs uppercase tracking-[0.05em] text-black hover:text-gray-500 transition-colors"
            >
              SEARCH
            </Link>
            <Link
              href="/account"
              className="hidden md:inline-block text-xs uppercase tracking-[0.05em] text-black hover:text-gray-500 transition-colors"
            >
              ACCOUNT
            </Link>

            {/* Cart — visible at all breakpoints */}
            <Link href="/cart" className="relative" aria-label="Shopping cart">
              {/* Desktop: text label, Mobile: bag icon */}
              <span className="hidden md:inline text-xs uppercase tracking-[0.05em] text-black hover:text-gray-500 transition-colors">
                CART
              </span>
              <ShoppingBag className="md:hidden" size={20} strokeWidth={1.5} />
              <CartBadge count={totalQuantity} />
            </Link>

            {/* Region indicator — desktop only */}
            <span className="hidden md:inline text-xs uppercase tracking-[0.05em] text-gray-400">
              INDIA
            </span>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────
          MOBILE MENU
          Slides in from the left with framer-motion. AnimatePresence
          handles the exit animation so the overlay doesn't disappear
          instantly when mobileMenuOpen becomes false.
      ───────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-white md:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          >
            {/* Close button — top-right corner */}
            <div className="flex h-[68px] items-center justify-between px-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <X size={22} strokeWidth={1.5} />
              </button>

              <Link
                href="/"
                className="absolute left-1/2 -translate-x-1/2 text-base font-bold uppercase tracking-[0.18em] text-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                BEDIFF
              </Link>

              <Link
                href="/cart"
                className="relative"
                aria-label="Shopping cart"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                <CartBadge count={totalQuantity} />
              </Link>
            </div>

            {/* Stacked navigation links */}
            <nav className="flex flex-col gap-8 px-6 pt-10" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-2xl font-medium uppercase tracking-[0.08em] text-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Secondary actions */}
            <div className="flex flex-col gap-6 px-6 pt-12 border-t border-border mt-12">
              <Link
                href="/search"
                className="flex items-center gap-3 text-sm uppercase tracking-[0.05em] text-black pt-6"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search size={18} strokeWidth={1.5} />
                SEARCH
              </Link>
              <Link
                href="/account"
                className="flex items-center gap-3 text-sm uppercase tracking-[0.05em] text-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} strokeWidth={1.5} />
                ACCOUNT
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
