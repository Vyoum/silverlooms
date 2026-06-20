"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import {
  PRODUCT_SORT_LABELS,
  type ProductSort,
} from "@/features/catalog/lib/product-sort";

interface ActiveFiltersProps {
  sort: ProductSort;
  productCount: number;
}

export function ActiveFilters({ sort, productCount }: ActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clearSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sort");
    const query = params.toString();
    router.push(query ? `/kurtis?${query}` : "/kurtis");
  };

  const breadcrumb =
    sort === "bestseller"
      ? "Home / Collections / Best Sellers"
      : sort === "new"
        ? "Home / Collections / New Arrivals"
        : "Home / Apparel / Kurtis & Sets";

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border bg-cream-dark px-4 py-3 md:px-16">
      <nav className="text-[11px] uppercase tracking-wider text-sage">
        {breadcrumb}
      </nav>
      <p className="text-[11px] text-sage-light">{productCount} products</p>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        {sort !== "all" && (
          <span className="inline-flex items-center gap-1 rounded-full border border-ink/20 bg-cream px-3 py-1 text-[11px] font-medium text-ink">
            Sort: {PRODUCT_SORT_LABELS[sort]}
            <button
              type="button"
              onClick={clearSort}
              aria-label={`Remove ${PRODUCT_SORT_LABELS[sort]} filter`}
            >
              <X className="size-3" />
            </button>
          </span>
        )}
        {sort !== "all" && (
          <button
            type="button"
            className="text-[11px] text-sage-light underline"
            onClick={clearSort}
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
