import type { Product } from "@/lib/types/product";
import type { ProductSort } from "@/features/catalog/lib/product-sort";
import { parseProductSort } from "@/features/catalog/lib/product-sort";
import {
  productMatchesCategory,
  toCatalogCategoryOption,
  type CatalogCategoryOption,
} from "@/features/catalog/lib/store-categories";

export type { CatalogCategoryOption };

export const FALLBACK_CATALOG_CATEGORY_OPTIONS: CatalogCategoryOption[] = [
  { slug: "leheriya", label: "Leheriya", keywords: ["leheriya"] },
  { slug: "bandhej", label: "Bandhej", keywords: ["bandhej", "bandhani"] },
  { slug: "shirts", label: "Shirts", keywords: ["shirt"] },
  { slug: "bags", label: "Bags", keywords: ["bag", "tote", "clutch"] },
];

export interface KurtisCatalogFilters {
  sort: ProductSort;
  category: string | null;
  size: string | null;
  color: string | null;
}

export function parseKurtisCategory(
  value: string | null | undefined,
  options: CatalogCategoryOption[],
) {
  if (!value) return null;
  return options.some((option) => option.slug === value) ? value : null;
}

export function parseKurtisCatalogFilters(
  params: {
    sort?: string;
    category?: string;
    size?: string;
    color?: string;
  },
  options: CatalogCategoryOption[] = FALLBACK_CATALOG_CATEGORY_OPTIONS,
): KurtisCatalogFilters {
  return {
    sort: parseProductSort(params.sort),
    category: parseKurtisCategory(params.category, options),
    size: params.size?.trim() || null,
    color: params.color?.trim().toLowerCase() || null,
  };
}

export function getCategoryLabel(
  slug: string | null,
  options: CatalogCategoryOption[],
) {
  if (!slug) return null;
  return options.find((option) => option.slug === slug)?.label ?? null;
}

export function applyKurtisCatalogFilters(
  products: Product[],
  filters: KurtisCatalogFilters,
  options: CatalogCategoryOption[],
): Product[] {
  let result = products;

  if (filters.category) {
    const option = options.find((item) => item.slug === filters.category);
    if (option) {
      result = result.filter(
        (product) =>
          product.categorySlug === option.slug ||
          productMatchesCategory(product.category, option.keywords),
      );
    }
  }

  if (filters.size) {
    result = result.filter(
      (product) => product.sizes?.includes(filters.size!) ?? false,
    );
  }

  if (filters.color) {
    const normalized = filters.color.toLowerCase();
    result = result.filter(
      (product) =>
        product.colors?.some((color) => color.hex.toLowerCase() === normalized) ??
        false,
    );
  }

  return result;
}

export function countByCategory(
  products: Product[],
  options: CatalogCategoryOption[],
) {
  return options.map((option) => ({
    ...option,
    count: products.filter(
      (product) =>
        product.categorySlug === option.slug ||
        productMatchesCategory(product.category, option.keywords),
    ).length,
  }));
}

export function toCatalogCategoryOptions(
  categories: Array<{ slug: string; name: string; keywords: string[] }>,
): CatalogCategoryOption[] {
  return categories.map(toCatalogCategoryOption);
}
