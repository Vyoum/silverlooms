import type { Product } from "@/lib/types/product";
import type { ProductSort } from "@/features/catalog/lib/product-sort";
import { parseProductSort } from "@/features/catalog/lib/product-sort";

export const KURTIS_CATEGORY_OPTIONS = [
  { slug: "kurti-sets", label: "Kurti Sets", pattern: /kurti set/i },
  { slug: "straight-kurtis", label: "Straight Kurtis", pattern: /straight kurti/i },
  { slug: "a-line-kurtis", label: "A-Line Kurtis", pattern: /a-line/i },
  { slug: "anarkali", label: "Anarkali", pattern: /anarkali/i },
] as const;

export type KurtisCategorySlug = (typeof KURTIS_CATEGORY_OPTIONS)[number]["slug"];

export interface KurtisCatalogFilters {
  sort: ProductSort;
  category: string | null;
  size: string | null;
  color: string | null;
}

export function parseKurtisCategory(value: string | null | undefined) {
  if (!value) return null;
  const match = KURTIS_CATEGORY_OPTIONS.find((option) => option.slug === value);
  return match?.slug ?? null;
}

export function parseKurtisCatalogFilters(params: {
  sort?: string;
  category?: string;
  size?: string;
  color?: string;
}): KurtisCatalogFilters {
  return {
    sort: parseProductSort(params.sort),
    category: parseKurtisCategory(params.category),
    size: params.size?.trim() || null,
    color: params.color?.trim().toLowerCase() || null,
  };
}

export function getCategoryLabel(slug: string | null) {
  if (!slug) return null;
  return KURTIS_CATEGORY_OPTIONS.find((option) => option.slug === slug)?.label ?? null;
}

export function applyKurtisCatalogFilters(
  products: Product[],
  filters: KurtisCatalogFilters,
): Product[] {
  let result = products;

  if (filters.category) {
    const option = KURTIS_CATEGORY_OPTIONS.find(
      (item) => item.slug === filters.category,
    );
    if (option) {
      result = result.filter((product) => option.pattern.test(product.category));
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

export function countByCategory(products: Product[]) {
  return KURTIS_CATEGORY_OPTIONS.map((option) => ({
    ...option,
    count: products.filter((product) => option.pattern.test(product.category))
      .length,
  }));
}
