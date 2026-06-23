import type { Product } from "@/lib/types/product";

export const JEWELLERY_CATEGORY_OPTIONS = [
  { slug: "necklace-sets", label: "Necklace Sets", pattern: /necklace|choker/i },
  { slug: "earrings", label: "Earrings", pattern: /earring/i },
  { slug: "bangles-kadas", label: "Bangles & Kadas", pattern: /bangle|kada/i },
  { slug: "rings", label: "Rings", pattern: /\bring\b/i },
  { slug: "pendants", label: "Pendants", pattern: /pendant/i },
] as const;

export type JewelleryCategorySlug = (typeof JEWELLERY_CATEGORY_OPTIONS)[number]["slug"];

export interface JewelleryCatalogFilters {
  category: string | null;
}

export function parseJewelleryCategory(value: string | null | undefined) {
  if (!value) return null;
  const match = JEWELLERY_CATEGORY_OPTIONS.find((option) => option.slug === value);
  return match?.slug ?? null;
}

export function parseJewelleryCatalogFilters(params: {
  category?: string;
}): JewelleryCatalogFilters {
  return {
    category: parseJewelleryCategory(params.category),
  };
}

export function getJewelleryCategoryLabel(slug: string | null) {
  if (!slug) return null;
  return JEWELLERY_CATEGORY_OPTIONS.find((option) => option.slug === slug)?.label ?? null;
}

export function applyJewelleryCatalogFilters(
  products: Product[],
  filters: JewelleryCatalogFilters,
): Product[] {
  if (!filters.category) return products;

  const option = JEWELLERY_CATEGORY_OPTIONS.find(
    (item) => item.slug === filters.category,
  );

  if (!option) return products;

  return products.filter((product) => option.pattern.test(product.category));
}
