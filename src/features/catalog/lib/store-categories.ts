export const CategoryKind = {
  APPAREL: "APPAREL",
  JEWELLERY: "JEWELLERY",
} as const;

export type CategoryKind = (typeof CategoryKind)[keyof typeof CategoryKind];

export type StoreCategory = {
  id: string;
  slug: string;
  name: string;
  kind: CategoryKind;
  keywords: string[];
  showInMarquee: boolean;
  showInCatalogFilter: boolean;
  sortOrder: number;
  heroImageUrl: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
};

export type CatalogCategoryOption = {
  slug: string;
  label: string;
  keywords: string[];
};

export const DEFAULT_STORE_CATEGORIES: Omit<
  StoreCategory,
  "id" | "heroImageUrl" | "heroTitle" | "heroSubtitle"
>[] = [
  {
    slug: "kurti-sets",
    name: "Kurti Sets",
    kind: CategoryKind.APPAREL,
    keywords: ["kurti set"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 10,
  },
  {
    slug: "straight-kurtis",
    name: "Straight Kurtis",
    kind: CategoryKind.APPAREL,
    keywords: ["straight kurti"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 20,
  },
  {
    slug: "a-line-kurtis",
    name: "A-Line Kurtis",
    kind: CategoryKind.APPAREL,
    keywords: ["a-line"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 30,
  },
  {
    slug: "anarkali",
    name: "Anarkali",
    kind: CategoryKind.APPAREL,
    keywords: ["anarkali"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 40,
  },
  {
    slug: "sarees",
    name: "Sarees",
    kind: CategoryKind.APPAREL,
    keywords: ["saree"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 50,
  },
  {
    slug: "leheriya",
    name: "Leheriya",
    kind: CategoryKind.APPAREL,
    keywords: ["leheriya"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 60,
  },
  {
    slug: "bandhej",
    name: "Bandhej",
    kind: CategoryKind.APPAREL,
    keywords: ["bandhej", "bandhani"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 70,
  },
  {
    slug: "suits",
    name: "Suits",
    kind: CategoryKind.APPAREL,
    keywords: ["suit"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 80,
  },
  {
    slug: "shirts",
    name: "Shirts",
    kind: CategoryKind.APPAREL,
    keywords: ["shirt"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 90,
  },
  {
    slug: "bags",
    name: "Bags",
    kind: CategoryKind.APPAREL,
    keywords: ["bag", "tote", "clutch"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 100,
  },
  {
    slug: "silver-jewellery",
    name: "Silver Jewellery",
    kind: CategoryKind.JEWELLERY,
    keywords: ["silver", "jewellery", "jewelry", "jhumka", "necklace", "earring"],
    showInMarquee: true,
    showInCatalogFilter: false,
    sortOrder: 200,
  },
  {
    slug: "german-silver",
    name: "German Silver",
    kind: CategoryKind.JEWELLERY,
    keywords: ["german silver"],
    showInMarquee: true,
    showInCatalogFilter: false,
    sortOrder: 210,
  },
  {
    slug: "necklace-sets",
    name: "Necklace Sets",
    kind: CategoryKind.JEWELLERY,
    keywords: ["necklace", "choker"],
    showInMarquee: false,
    showInCatalogFilter: true,
    sortOrder: 220,
  },
  {
    slug: "earrings",
    name: "Earrings",
    kind: CategoryKind.JEWELLERY,
    keywords: ["earring"],
    showInMarquee: false,
    showInCatalogFilter: true,
    sortOrder: 230,
  },
  {
    slug: "bangles-kadas",
    name: "Bangles & Kadas",
    kind: CategoryKind.JEWELLERY,
    keywords: ["bangle", "kada"],
    showInMarquee: false,
    showInCatalogFilter: true,
    sortOrder: 240,
  },
  {
    slug: "rings",
    name: "Rings",
    kind: CategoryKind.JEWELLERY,
    keywords: ["ring"],
    showInMarquee: false,
    showInCatalogFilter: true,
    sortOrder: 250,
  },
  {
    slug: "pendants",
    name: "Pendants",
    kind: CategoryKind.JEWELLERY,
    keywords: ["pendant"],
    showInMarquee: false,
    showInCatalogFilter: true,
    sortOrder: 260,
  },
];

export function toCatalogCategoryOption(
  category: Pick<StoreCategory, "slug" | "name" | "keywords">,
): CatalogCategoryOption {
  return {
    slug: category.slug,
    label: category.name,
    keywords:
      category.keywords.length > 0
        ? category.keywords
        : [category.name.toLowerCase()],
  };
}

export function productMatchesCategory(
  categoryLabel: string,
  keywords: string[],
) {
  const haystack = categoryLabel.toLowerCase();
  const terms =
    keywords.length > 0 ? keywords : [categoryLabel.toLowerCase()];
  return terms.some((term) => haystack.includes(term.toLowerCase()));
}
