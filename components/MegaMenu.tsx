"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUiStore } from "@/lib/uiStore";
import { shopMenu, brandMenu, infoMenu } from "@/lib/navigation";

export default function MegaMenu() {
  const { activeMegaMenu, setActiveMegaMenu, setCategoryFilter } = useUiStore();
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    setCategoryFilter(category);
    router.push(`/?category=${category.toLowerCase()}#products`);
    setActiveMegaMenu(null);
  };

  const getMenuData = () => {
    switch (activeMegaMenu) {
      case "SHOP":
        return shopMenu;
      case "BRAND":
        return brandMenu;
      case "INFO":
        return infoMenu;
      default:
        return null;
    }
  };

  const menuData = getMenuData();

  return (
    <AnimatePresence>
      {activeMegaMenu && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/5 hidden md:block"
            style={{ top: "68px" }}
            onClick={() => setActiveMegaMenu(null)}
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 z-40 bg-white border-b border-border hidden md:block"
            style={{ top: "68px" }}
          >
            <div className="mx-auto max-w-content px-4 md:px-6 py-12 flex justify-between items-start">
              <div className="flex gap-24">
                {menuData?.columns.map((col, idx) => (
                  <div key={idx} className="flex flex-col gap-6 min-w-[120px]">
                    <h3 className="text-xs uppercase tracking-[0.05em] font-medium text-gray-400">
                      {col.title}
                    </h3>
                    <ul className="flex flex-col gap-4">
                      {col.links.map((link: any, lIdx: number) => (
                        <li key={lIdx}>
                          {link.href ? (
                            <Link
                              href={link.href}
                              onClick={() => setActiveMegaMenu(null)}
                              className="text-sm uppercase tracking-[0.05em] font-medium text-black hover:text-gray-500 transition-colors"
                            >
                              {link.label}
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleCategoryClick(link.filterCategory || "")}
                              className="text-sm uppercase tracking-[0.05em] font-medium text-black hover:text-gray-500 transition-colors"
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

              {/* Optional Editorial Image */}
              {menuData && "image" in menuData && (menuData as any).image && (
                <div className="w-[300px] h-[200px] relative opacity-90 bg-gray-50">
                  <Image
                    src={(menuData as any).image}
                    alt="Menu Image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
