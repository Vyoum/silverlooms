export type CategoryKind = "APPAREL" | "JEWELLERY";

export type StoreCategory = {
  id: string;
  slug: string;
  name: string;
  kind: CategoryKind;
  keywords: string[];
  showInMarquee: boolean;
  showInCatalogFilter: boolean;
  sortOrder: number;
};

export type CatalogCategoryOption = {
  slug: string;
  label: string;
  keywords: string[];
};

export const DEFAULT_STORE_CATEGORIES: Omit<
  StoreCategory,
  "id"
>[] = [
  {
    slug: "kurti-sets",
    name: "Kurti Sets",
    kind: "APPAREL",
    keywords: ["kurti set"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 10,
  },
  {
    slug: "straight-kurtis",
    name: "Straight Kurtis",
    kind: "APPAREL",
    keywords: ["straight kurti"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 20,
  },
  {
    slug: "a-line-kurtis",
    name: "A-Line Kurtis",
    kind: "APPAREL",
    keywords: ["a-line"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 30,
  },
  {
    slug: "anarkali",
    name: "Anarkali",
    kind: "APPAREL",
    keywords: ["anarkali"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 40,
  },
  {
    slug: "sarees",
    name: "Sarees",
    kind: "APPAREL",
    keywords: ["saree"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 50,
  },
  {
    slug: "leheriya",
    name: "Leheriya",
    kind: "APPAREL",
    keywords: ["leheriya"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 60,
  },
  {
    slug: "bandhej",
    name: "Bandhej",
    kind: "APPAREL",
    keywords: ["bandhej", "bandhani"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 70,
  },
  {
    slug: "suits",
    name: "Suits",
    kind: "APPAREL",
    keywords: ["suit"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 80,
  },
  {
    slug: "shirts",
    name: "Shirts",
    kind: "APPAREL",
    keywords: ["shirt"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 90,
  },
  {
    slug: "bags",
    name: "Bags",
    kind: "APPAREL",
    keywords: ["bag", "tote", "clutch"],
    showInMarquee: true,
    showInCatalogFilter: true,
    sortOrder: 100,
  },
  {
    slug: "silver-jewellery",
    name: "Silver Jewellery",
    kind: "JEWELLERY",
    keywords: ["silver", "jewellery", "jewelry", "jhumka", "necklace", "earring"],
    showInMarquee: true,
    showInCatalogFilter: false,
    sortOrder: 200,
  },
  {
    slug: "german-silver",
    name: "German Silver",
    kind: "JEWELLERY",
    keywords: ["german silver"],
    showInMarquee: true,
    showInCatalogFilter: false,
    sortOrder: 210,
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
