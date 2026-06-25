
export const siteNavLinks = [
  { label: "Apparel", href: "/kurtis" },
  { label: "Jewellery", href: "/jewellery" },
  { label: "New In", href: "/kurtis?sort=new" },
  { label: "Collections", href: "/kurtis?sort=bestseller" },
  { label: "About Us", href: "/#editorial" },
] as const;

/** @deprecated Use siteNavLinks */
export const mainNavLinks = siteNavLinks;

/** @deprecated Use siteNavLinks */
export const homeNavLinks = siteNavLinks;

export const categoryMarquee = [
  "SUITS",
  "KURTIS",
  "ANARKALI",
  "SAREES",
  "LEHERIYA",
  "BANDHEJ",
  "SHIRTS",
  "BAGS",
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

const fallbackApparelNavLinks: MobileNavLink[] = [
  { label: "Kurti Sets", href: "/kurtis?category=kurti-sets" },
  { label: "Leheriya", href: "/kurtis?category=leheriya" },
  { label: "Bandhej", href: "/kurtis?category=bandhej" },
  { label: "Shirts", href: "/kurtis?category=shirts" },
  { label: "Bags", href: "/kurtis?category=bags" },
  { label: "Suits", href: "/kurtis?category=suits" },
];

export function buildMobileNavSections(
  apparelCategories: Array<{
    name: string;
    slug: string;
    showInCatalogFilter?: boolean;
  }> = [],
): MobileNavSection[] {
  const apparelLinks =
    apparelCategories.length > 0
      ? apparelCategories
          .filter((category) => category.showInCatalogFilter !== false)
          .map((category) => ({
            label: category.name,
            href: `/kurtis?category=${category.slug}`,
          }))
      : fallbackApparelNavLinks;

  return [
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
      links: apparelLinks,
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
}

export const mobileNavSections: MobileNavSection[] = buildMobileNavSections();
