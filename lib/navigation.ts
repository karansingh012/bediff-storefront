export type MegaMenuType = "SHOP" | "BRAND" | "INFO" | null;

export const shopMenu = {
  columns: [
    {
      title: "PRODUCT",
      links: [
        { label: "T-SHIRTS", filterCategory: "Tops" },
        { label: "SHORTS", filterCategory: "Shorts" },
        { label: "VESTS", filterCategory: "Tops" },
        { label: "TOPS", filterCategory: "Tops" },
        { label: "PANTS", filterCategory: "Pants" },
        { label: "HOODIES", filterCategory: "Outerwear" },
      ],
    },
    {
      title: "CATEGORY",
      links: [
        { label: "RUNNING", filterCategory: "Shorts" },
        { label: "TRAINING", filterCategory: "Pants" },
        { label: "PERFORMANCE", filterCategory: "Outerwear" },
        { label: "LIFESTYLE", filterCategory: "Tops" },
      ],
    },
    {
      title: "COLLECTION",
      links: [
        { label: "SUMMER 26", filterCategory: "Shorts" },
        { label: "NEW ARRIVALS", filterCategory: "Outerwear" },
        { label: "RUNNING", filterCategory: "Shorts" },
        { label: "TRAINING", filterCategory: "Pants" },
        { label: "BEST SELLERS", filterCategory: "Tops" },
      ],
    },
  ],
  image: "/products/placeholder.svg", // Fallback image from existing BEDIFF assets
};

export const brandMenu = {
  columns: [
    {
      title: "BRAND",
      links: [
        { label: "MEDIA", href: "/media" },
        { label: "ABOUT", href: "/about" },
      ],
    },
  ],
  image: "/products/placeholder.svg",
};

export const infoMenu = {
  columns: [
    {
      title: "INFO",
      links: [
        { label: "SHIPPING & RETURNS", href: "/shipping" },
        { label: "CONTACT", href: "/contact" },
        { label: "CAREERS", href: "/careers" },
        { label: "FAQ", href: "/faq" },
      ],
    },
  ],
};
