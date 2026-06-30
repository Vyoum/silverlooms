import type { Product } from "@/lib/types/product";
import {
  parsePriceSort,
  sortProductsByPrice,
  type PriceSort,
} from "@/features/catalog/lib/price-sort";

export const JEWELLERY_CATEGORY_OPTIONS = [
  { slug: "necklace-sets", label: "Necklace Sets", pattern: /necklace|choker/i },
  { slug: "earrings", label: "Earrings", pattern: /earring/i },
  { slug: "bangles-kadas", label: "Bangles & Kadas", pattern: /bangle|kada/i },
  { slug: "rings", label: "Rings", pattern: /\bring\b/i },
  { slug: "pendants", label: "Pendants", pattern: /pendant/i },
] as const;

export const JEWELLERY_MATERIAL_OPTIONS = [
  { slug: "german-silver", label: "German Silver", pattern: /german silver/i },
  { slug: "anti-tarnish", label: "Anti-Tarnish", pattern: /anti[- ]?tarnish/i },
  { slug: "kin-fog", label: "Kin Fog", pattern: /kin fog/i },
  { slug: "oxidised-silver", label: "Oxidised Silver", pattern: /oxidis/i },
  { slug: "temple-jewellery", label: "Temple Jewellery", pattern: /temple/i },
] as const;

export type JewelleryCategorySlug = (typeof JEWELLERY_CATEGORY_OPTIONS)[number]["slug"];
export type JewelleryMaterialSlug = (typeof JEWELLERY_MATERIAL_OPTIONS)[number]["slug"];

export interface JewelleryCatalogFilters {
  category: JewelleryCategorySlug | null;
  material: JewelleryMaterialSlug | null;
  price: PriceSort;
}

function productSearchText(product: Product) {
  return [
    product.category,
    product.collection,
    product.name,
    product.description,
  ]
    .filter(Boolean)
    .join(" ");
}

function productMatchesJewelleryCategory(
  product: Product,
  slug: JewelleryCategorySlug,
) {
  if (product.categorySlug === slug) {
    return true;
  }

  const option = JEWELLERY_CATEGORY_OPTIONS.find((item) => item.slug === slug);
  return option ? option.pattern.test(productSearchText(product)) : false;
}

function productMatchesJewelleryMaterial(
  product: Product,
  slug: JewelleryMaterialSlug,
) {
  if (product.materialSlug === slug) {
    return true;
  }

  const option = JEWELLERY_MATERIAL_OPTIONS.find((item) => item.slug === slug);
  return option ? option.pattern.test(productSearchText(product)) : false;
}

export function parseJewelleryCategory(value: string | null | undefined) {
  if (!value) return null;
  const match = JEWELLERY_CATEGORY_OPTIONS.find((option) => option.slug === value);
  return match?.slug ?? null;
}

export function parseJewelleryMaterial(value: string | null | undefined) {
  if (!value) return null;
  const match = JEWELLERY_MATERIAL_OPTIONS.find((option) => option.slug === value);
  return match?.slug ?? null;
}

export function parseJewelleryCatalogFilters(params: {
  category?: string;
  material?: string;
  price?: string;
}): JewelleryCatalogFilters {
  return {
    category: parseJewelleryCategory(params.category),
    material: parseJewelleryMaterial(params.material),
    price: parsePriceSort(params.price),
  };
}

export function buildJewelleryCatalogHref(filters: Partial<JewelleryCatalogFilters>) {
  const params = new URLSearchParams();

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.material) {
    params.set("material", filters.material);
  }

  if (filters.price) {
    params.set("price", filters.price);
  }

  const query = params.toString();
  return query ? `/jewellery?${query}` : "/jewellery";
}

export function getJewelleryCategoryLabel(slug: string | null) {
  if (!slug) return null;
  return JEWELLERY_CATEGORY_OPTIONS.find((option) => option.slug === slug)?.label ?? null;
}

export function getJewelleryMaterialLabel(slug: string | null) {
  if (!slug) return null;
  return JEWELLERY_MATERIAL_OPTIONS.find((option) => option.slug === slug)?.label ?? null;
}

export function applyJewelleryCatalogFilters(
  products: Product[],
  filters: JewelleryCatalogFilters,
): Product[] {
  let result = products;

  if (filters.category) {
    result = result.filter((product) =>
      productMatchesJewelleryCategory(product, filters.category!),
    );
  }

  if (filters.material) {
    result = result.filter((product) =>
      productMatchesJewelleryMaterial(product, filters.material!),
    );
  }

  return sortProductsByPrice(result, filters.price);
}
