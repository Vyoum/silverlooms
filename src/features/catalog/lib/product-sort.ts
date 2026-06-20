import type { Product } from "@/lib/types/product";

export const PRODUCT_SORT_OPTIONS = ["all", "bestseller", "new"] as const;

export type ProductSort = (typeof PRODUCT_SORT_OPTIONS)[number];

export const PRODUCT_SORT_LABELS: Record<ProductSort, string> = {
  all: "All Products",
  bestseller: "Best Selling",
  new: "New Arrivals",
};

export function parseProductSort(value: string | null | undefined): ProductSort {
  if (value === "bestseller" || value === "new") {
    return value;
  }
  return "all";
}

export function filterProductsBySort(
  products: Product[],
  sort: ProductSort,
): Product[] {
  switch (sort) {
    case "bestseller":
      return products.filter((product) => product.badge === "BESTSELLER");
    case "new":
      return products.filter((product) => product.badge === "NEW");
    default:
      return products;
  }
}
