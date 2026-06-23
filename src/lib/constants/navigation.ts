import { KURTIS_CATEGORY_OPTIONS } from "@/features/kurtis/lib/kurtis-filters";

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
  { label: "Collections", href: "/kurtis?sort=bestseller" },
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

export const jewelleryCategoryLinks = [
  { label: "All Jewellery", href: "/jewellery" },
  { label: "Necklace Sets", href: "/jewellery?category=necklace-sets" },
  { label: "Earrings", href: "/jewellery?category=earrings" },
  { label: "Bangles & Kadas", href: "/jewellery?category=bangles-kadas" },
  { label: "Rings", href: "/jewellery?category=rings" },
  { label: "Pendants", href: "/jewellery?category=pendants" },
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

export interface MobileNavLink {
  label: string;
  href: string;
}

export interface MobileNavSection {
  title: string;
  links: readonly MobileNavLink[];
}

export const mobileNavSections: MobileNavSection[] = [
  {
    title: "Shop",
    links: [
      { label: "All Apparel", href: "/kurtis" },
      { label: "All Jewellery", href: "/jewellery" },
      { label: "New In", href: "/kurtis?sort=new" },
      { label: "Best Sellers", href: "/kurtis?sort=bestseller" },
    ],
  },
  {
    title: "Apparel",
    links: KURTIS_CATEGORY_OPTIONS.map((option) => ({
      label: option.label,
      href: `/kurtis?category=${option.slug}`,
    })),
  },
  {
    title: "Jewellery",
    links: [...jewelleryCategoryLinks],
  },
  {
    title: "Discover",
    links: [
      { label: "About Us", href: "/#editorial" },
      { label: "Good Reads", href: "/#good-reads" },
    ],
  },
];
