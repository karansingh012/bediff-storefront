export type MegaMenuType = "SHOP" | "BRAND" | "INFO" | null;

export const shopMenu = {
  columns: [
    {
      title: "PRODUCT",
      links: [
        { label: "T-SHIRTS", filterCategory: "Tops" },
        { label: "OUTERWEAR", filterCategory: "Outerwear" },
        { label: "SHORTS & TIGHTS", filterCategory: "Shorts" },
        { label: "BOTTOMS", filterCategory: "Pants" },
        { label: "VESTS", filterCategory: "Tops" },
        { label: "HEADWEAR", filterCategory: "Tops" },
        { label: "SOCKS", filterCategory: "Tops" },
      ],
    },
    {
      title: "CATEGORY",
      links: [
        { label: "RUNNING", filterCategory: "Shorts" },
        { label: "TRAINING", filterCategory: "Pants" },
        { label: "LIFESTYLE", filterCategory: "Tops" },
      ],
    },
    {
      title: "COLLECTION",
      links: [
        { label: "BEDIFF COLLECTION", filterCategory: "" },
        { label: "SUMMER SPORT", filterCategory: "Shorts" },
        { label: "SPRING RUNNING", filterCategory: "Shorts" },
        { label: "SPRING TRAINING", filterCategory: "Pants" },
        { label: "LIMITED DROPS", filterCategory: "Outerwear" },
      ],
    },
  ],
  image: "/products/placeholder.svg",
};

export const brandMenu = {
  columns: [
    {
      title: "BRAND",
      links: [
        { label: "ABOUT BEDIFF", href: "/about" },
        { label: "OUR STORY", href: "/brand/story" },
        { label: "DESIGN", href: "/brand/design" },
        { label: "PERFORMANCE", href: "/brand/performance" },
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
        { label: "FAQ", href: "/faq" },
        { label: "CAREERS", href: "/careers" },
      ],
    },
  ],
};
