"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import {
  PRODUCT_SORT_LABELS,
} from "@/features/catalog/lib/product-sort";
import type { CatalogCategoryOption } from "@/features/kurtis/lib/kurtis-filters";
import {
  getCategoryLabel,
  type KurtisCatalogFilters,
} from "@/features/kurtis/lib/kurtis-filters";

interface ActiveFiltersProps {
  filters: KurtisCatalogFilters;
  productCount: number;
  categoryOptions: CatalogCategoryOption[];
}

export function ActiveFilters({
  filters,
  productCount,
  categoryOptions,
}: ActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clearAll = () => {
    router.push("/kurtis");
  };

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    const query = params.toString();
    router.push(query ? `/kurtis?${query}` : "/kurtis");
  };

  const breadcrumb =
    filters.sort === "bestseller"
      ? "Home / Collections / Best Sellers"
      : filters.sort === "new"
        ? "Home / Collections / New Arrivals"
        : "Home / Apparel / Kurtis & Sets";

  const categoryLabel = getCategoryLabel(filters.category, categoryOptions);
  const hasChips =
    filters.sort !== "all" ||
    Boolean(filters.category) ||
    Boolean(filters.size) ||
    Boolean(filters.color);

  return (
    <div className="border-b border-border bg-cream-dark px-4 py-3 md:px-16">
      <div className="flex flex-wrap items-center gap-3">
        <nav className="text-[11px] uppercase tracking-wider text-sage">
          {breadcrumb}
        </nav>
        <p className="hidden text-[11px] text-sage-light sm:block">
          {productCount} products
        </p>
        {hasChips && (
          <div className="ml-auto hidden flex-wrap items-center gap-2 md:flex">
            {filters.sort !== "all" && (
              <Chip
                label={`Collection: ${PRODUCT_SORT_LABELS[filters.sort]}`}
                onRemove={() => removeParam("sort")}
              />
            )}
            {categoryLabel && (
              <Chip
                label={`Category: ${categoryLabel}`}
                onRemove={() => removeParam("category")}
              />
            )}
            {filters.size && (
              <Chip
                label={`Size: ${filters.size}`}
                onRemove={() => removeParam("size")}
              />
            )}
            {filters.color && (
              <Chip label="Color selected" onRemove={() => removeParam("color")} />
            )}
            <button
              type="button"
              className="text-[11px] text-sage-light underline"
              onClick={clearAll}
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-ink/20 bg-cream px-3 py-1 text-[11px] font-medium text-ink">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove ${label}`}>
        <X className="size-3" />
      </button>
    </span>
  );
}
