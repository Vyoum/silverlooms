export const mainNavLinks = [
  { label: "Apparel", href: "/kurtis" },
  { label: "Jewellery", href: "/jewellery" },
  { label: "Editorial", href: "/#good-reads" },
  { label: "Heritage", href: "/#editorial" },
] as const;

export const homeNavLinks = [
  { label: "All Products", href: "/kurtis" },
  { label: "Jewellery", href: "/jewellery" },
  { label: "New In", href: "/kurtis?sort=new" },
  { label: "Collections", href: "/#shop-by-style" },
  { label: "About Us", href: "/#editorial" },
] as const;

export const categoryMarquee = [
  "SUITS",
  "KURTIS",
  "ANARKALI",
  "SAREES",
  "LEHERIYA",
  "BANDHEJ",
  "SILVER JEWELLERY",
  "GERMAN SILVER",
] as const;

export const jewelleryCategoryTabs = [
  "All Jewellery",
  "Necklace Sets",
  "Earrings",
  "Bangles & Kadas",
  "Rings",
  "Pendants",
] as const;

export const jewelleryMaterialFilters = [
  "German Silver",
  "Anti-Tarnish",
  "Kin Fog",
  "Oxidised Silver",
  "Temple Jewellery",
] as const;

/** @deprecated Use jewelleryCategoryTabs */
export const jewellerySubcategories = jewelleryCategoryTabs;

export const footerLinks = {
  shop: [
    { label: "Apparel", href: "/kurtis" },
    { label: "Silver Jewellery", href: "/jewellery" },
    { label: "New Arrivals", href: "/kurtis?sort=new" },
    { label: "Best Sellers", href: "/kurtis?sort=bestseller" },
  ],
  help: [
    { label: "Track Order", href: "#" },
    { label: "Returns & Exchanges", href: "#" },
    { label: "Shipping Info", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  company: [
    { label: "Our Story", href: "#" },
    { label: "Sustainability", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
} as const;
