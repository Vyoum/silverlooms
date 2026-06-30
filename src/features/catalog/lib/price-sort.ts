import type { Product } from "@/lib/types/product";

export const PRICE_SORT_OPTIONS = ["low", "high"] as const;

export type PriceSort = (typeof PRICE_SORT_OPTIONS)[number] | null;

export const PRICE_SORT_LABELS: Record<(typeof PRICE_SORT_OPTIONS)[number], string> = {
  low: "Price: Low to High",
  high: "Price: High to Low",
};

export function parsePriceSort(value: string | null | undefined): PriceSort {
  if (value === "low" || value === "high") {
    return value;
  }
  return null;
}

export function sortProductsByPrice(products: Product[], priceSort: PriceSort): Product[] {
  if (!priceSort) {
    return products;
  }

  const sorted = [...products];
  sorted.sort((left, right) =>
    priceSort === "low" ? left.price - right.price : right.price - left.price,
  );
  return sorted;
}
