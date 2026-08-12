"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, User, ShoppingBag, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTotalQuantity, useCartStore } from "@/lib/cartStore";
import { useUiStore } from "@/lib/uiStore";
import { shopMenu, brandMenu, infoMenu } from "@/lib/navigation";
import SearchOverlay from "./SearchOverlay";
import MegaMenu from "./MegaMenu";

function CartBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center bg-black text-white text-[9px] font-medium leading-none px-1">
      {count}
    </span>
  );
}

function MobileAccordion({ label, menuData, closeMenu }: { label: string, menuData: any, closeMenu: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const setCategoryFilter = useUiStore((state) => state.setCategoryFilter);

  const handleCategoryClick = (category: string) => {
    setCategoryFilter(category);
    router.push(`/?category=${category.toLowerCase()}#products`);
    closeMenu();
  };

  return (
    <div className="flex flex-col border-b border-border py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between text-xl font-medium uppercase tracking-[0.08em] text-black w-full text-left"
      >
        {label}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={20} strokeWidth={1.5} />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-6 pb-2 flex flex-col gap-6">
              {menuData.columns.map((col: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-3">
                  <h4 className="text-[10px] uppercase tracking-[0.05em] font-medium text-gray-400">
                    {col.title}
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {col.links.map((link: any, lIdx: number) => (
                      <li key={lIdx}>
                        {link.href ? (
                          <Link 
                            href={link.href} 
                            onClick={closeMenu}
                            className="text-sm font-medium uppercase tracking-[0.05em] text-black hover:text-gray-500"
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleCategoryClick(link.filterCategory || "")}
                            className="text-sm font-medium uppercase tracking-[0.05em] text-black hover:text-gray-500 text-left"
                          >
                            {link.label}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const { 
    isMobileMenuOpen, 
    openMobileMenu, 
    closeMobileMenu, 
    openSearch,
    activeMegaMenu,
    setActiveMegaMenu,
    setCategoryFilter
  } = useUiStore();
  const openCart = useCartStore((state) => state.openCart);
  const totalQuantity = useTotalQuantity();
  const router = useRouter();

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
      if (e.key === "Escape") {
        if (isMobileMenuOpen) closeMobileMenu();
        if (activeMegaMenu) setActiveMegaMenu(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, closeMobileMenu, activeMegaMenu, setActiveMegaMenu]);

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
              <Link
                href="/#products"
                onClick={() => {
                  setCategoryFilter("");
                  setActiveMegaMenu(null);
                }}
                className="text-xs font-medium uppercase tracking-[0.05em] text-black hover:text-gray-500 transition-colors"
              >
                COLLECTION
              </Link>
              {["SHOP", "BRAND", "INFO"].map((label) => {
                const isActive = activeMegaMenu === label;
                return (
                  <button
                    key={label}
                    onClick={() => setActiveMegaMenu(isActive ? null : label as any)}
                    className={`text-xs font-medium uppercase tracking-[0.05em] transition-colors ${isActive ? "text-gray-500" : "text-black hover:text-gray-500"}`}
                    aria-expanded={isActive}
                  >
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ───────── CENTER: Wordmark ───────── */}
          <Link
            href="/"
            onClick={() => setActiveMegaMenu(null)}
            className="absolute left-1/2 -translate-x-1/2 text-base md:text-lg font-bold uppercase tracking-[0.18em] text-black"
            aria-label="BEDIFF Home"
          >
            BEDIFF
          </Link>

          {/* ───────── RIGHT: Desktop action links / Mobile cart icon ───────── */}
          <div className="flex items-center justify-end gap-7 md:w-1/3">
            <button
              onClick={() => {
                setActiveMegaMenu(null);
                openSearch();
              }}
              className="hidden md:inline-block text-xs font-medium uppercase tracking-[0.05em] text-black hover:text-gray-500 transition-colors"
            >
              SEARCH
            </button>
            <Link
              href="/account"
              onClick={() => setActiveMegaMenu(null)}
              className="hidden md:inline-block text-xs font-medium uppercase tracking-[0.05em] text-black hover:text-gray-500 transition-colors"
            >
              ACCOUNT
            </Link>

            <button 
              type="button"
              className="relative flex items-center" 
              aria-label="Shopping cart"
              onClick={() => {
                setActiveMegaMenu(null);
                openCart();
              }}
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

      <MegaMenu />
      <SearchOverlay />

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-white md:hidden overflow-y-auto"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex h-[68px] items-center justify-between px-4 border-b border-transparent sticky top-0 bg-white z-10">
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

            <nav className="flex flex-col px-6 pt-6" aria-label="Mobile navigation">
              <Link
                href="/#products"
                className="flex items-center justify-between text-xl font-medium uppercase tracking-[0.08em] text-black w-full text-left border-b border-border py-4"
                onClick={(e) => {
                  setCategoryFilter("");
                  closeMobileMenu();
                }}
              >
                COLLECTION
              </Link>
              <MobileAccordion label="SHOP" menuData={shopMenu} closeMenu={closeMobileMenu} />
              <MobileAccordion label="BRAND" menuData={brandMenu} closeMenu={closeMobileMenu} />
              <MobileAccordion label="INFO" menuData={infoMenu} closeMenu={closeMobileMenu} />
            </nav>

            <div className="flex flex-col gap-6 px-6 pt-10 mt-10">
              <button
                type="button"
                className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.05em] text-black pt-6 border-t border-border"
                onClick={() => {
                  closeMobileMenu();
                  openSearch();
                }}
              >
                <Search size={18} strokeWidth={1.5} />
                SEARCH
              </button>
              <Link
                href="/account"
                className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.05em] text-black"
                onClick={() => closeMobileMenu()}
              >
                <User size={18} strokeWidth={1.5} />
                ACCOUNT
              </Link>
              <div className="pt-6 mt-6 border-t border-border pb-12">
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
