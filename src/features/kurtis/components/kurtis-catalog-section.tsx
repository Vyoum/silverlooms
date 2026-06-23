"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Tag, X } from "lucide-react";
import {
  PRODUCT_SORT_LABELS,
  PRODUCT_SORT_OPTIONS,
  type ProductSort,
} from "@/features/catalog/lib/product-sort";
import type { Product } from "@/lib/types/product";
import {
  KURTIS_CATEGORY_OPTIONS,
  getCategoryLabel,
  type KurtisCatalogFilters,
} from "@/features/kurtis/lib/kurtis-filters";
import { KurtisProductGrid } from "./product-grid";
import { cn } from "@/lib/utils";

const sizes = ["XS", "S", "M", "L", "XL"];

interface KurtisCatalogSectionProps {
  products: Product[];
  filters: KurtisCatalogFilters;
  baseProducts: Product[];
}

type PanelType = "category" | "filter" | null;

function buildKurtisUrl(
  searchParams: URLSearchParams,
  updates: Partial<KurtisCatalogFilters>,
) {
  const params = new URLSearchParams(searchParams.toString());

  const apply = (key: keyof KurtisCatalogFilters, value: string | null) => {
    if (!value || value === "all") {
      params.delete(key === "sort" ? "sort" : key);
    } else {
      params.set(key === "sort" ? "sort" : key, value);
    }
  };

  if ("sort" in updates) apply("sort", updates.sort ?? null);
  if ("category" in updates) apply("category", updates.category ?? null);
  if ("size" in updates) apply("size", updates.size ?? null);
  if ("color" in updates) apply("color", updates.color ?? null);

  const query = params.toString();
  return query ? `/kurtis?${query}` : "/kurtis";
}

export function KurtisCatalogSection({
  products,
  filters,
  baseProducts,
}: KurtisCatalogSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const categoryCounts = useMemo(
    () =>
      KURTIS_CATEGORY_OPTIONS.map((option) => ({
        ...option,
        count: baseProducts.filter((product) =>
          option.pattern.test(product.category),
        ).length,
      })),
    [baseProducts],
  );

  const colorOptions = useMemo(() => {
    const map = new Map<string, string | undefined>();
    for (const product of baseProducts) {
      for (const color of product.colors) {
        map.set(color.hex.toLowerCase(), color.name);
      }
    }
    return Array.from(map.entries()).map(([hex, name]) => ({ hex, name }));
  }, [baseProducts]);

  useEffect(() => {
    if (!openPanel) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPanel(null);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openPanel]);

  const pushFilters = (updates: Partial<KurtisCatalogFilters>) => {
    router.push(buildKurtisUrl(searchParams, updates));
  };

  const clearAll = () => {
    router.push("/kurtis");
  };

  const activeCategoryLabel = getCategoryLabel(filters.category);
  const hasActiveFilters =
    filters.sort !== "all" ||
    Boolean(filters.category) ||
    Boolean(filters.size) ||
    Boolean(filters.color);

  return (
    <div className="py-6 md:py-12">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOpenPanel("category")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.9px] transition-colors md:gap-2 md:px-4 md:py-2.5 md:text-[11px] md:tracking-[1.1px]",
              filters.category
                ? "border-ink bg-ink text-cream"
                : "border-border bg-cream text-ink hover:border-ink",
            )}
          >
            <Tag className="size-3 md:size-3.5" />
            {activeCategoryLabel ?? "Category"}
          </button>
          <button
            type="button"
            onClick={() => setOpenPanel("filter")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.9px] transition-colors md:gap-2 md:px-4 md:py-2.5 md:text-[11px] md:tracking-[1.1px]",
              filters.sort !== "all" || filters.size || filters.color
                ? "border-ink bg-ink text-cream"
                : "border-border bg-cream text-ink hover:border-ink",
            )}
          >
            <SlidersHorizontal className="size-3 md:size-3.5" />
            Filter
          </button>
        </div>
        <p className="text-[11px] uppercase tracking-wider text-sage">
          {products.length} products
        </p>
      </div>

      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {filters.sort !== "all" && (
            <FilterChip
              label={`Collection: ${PRODUCT_SORT_LABELS[filters.sort]}`}
              onRemove={() => pushFilters({ sort: "all" })}
            />
          )}
          {activeCategoryLabel && (
            <FilterChip
              label={`Category: ${activeCategoryLabel}`}
              onRemove={() => pushFilters({ category: null })}
            />
          )}
          {filters.size && (
            <FilterChip
              label={`Size: ${filters.size}`}
              onRemove={() => pushFilters({ size: null })}
            />
          )}
          {filters.color && (
            <FilterChip
              label="Color"
              swatch={filters.color}
              onRemove={() => pushFilters({ color: null })}
            />
          )}
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] text-sage underline"
          >
            Clear all
          </button>
        </div>
      )}

      <KurtisProductGrid products={products} sort={filters.sort} />

      {openPanel && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:px-4">
          <button
            type="button"
            aria-label="Close panel"
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setOpenPanel(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 max-h-[85dvh] w-full overflow-y-auto rounded-t-2xl border border-border bg-cream p-6 shadow-2xl sm:max-w-md sm:rounded-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-ink">
                {openPanel === "category" ? "Category" : "Filter"}
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpenPanel(null)}
                className="text-sage hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            {openPanel === "category" ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    pushFilters({ category: null });
                    setOpenPanel(null);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                    !filters.category
                      ? "border-ink bg-ink text-cream"
                      : "border-border text-ink hover:border-ink",
                  )}
                >
                  <span>All Categories</span>
                  <span className="text-xs opacity-70">{baseProducts.length}</span>
                </button>
                {categoryCounts.map((category) => (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => {
                      pushFilters({ category: category.slug });
                      setOpenPanel(null);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                      filters.category === category.slug
                        ? "border-ink bg-ink text-cream"
                        : "border-border text-ink hover:border-ink",
                    )}
                  >
                    <span>{category.label}</span>
                    <span className="text-xs opacity-70">{category.count}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <section>
                  <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[1.65px] text-sage">
                    Collection
                  </h3>
                  <div className="space-y-2">
                    {PRODUCT_SORT_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          pushFilters({ sort: option });
                          setOpenPanel(null);
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm",
                          filters.sort === option
                            ? "font-medium text-ink"
                            : "text-sage hover:text-ink",
                        )}
                      >
                        <span
                          className={cn(
                            "size-4 rounded-full border",
                            filters.sort === option
                              ? "border-ink bg-ink"
                              : "border-sage-light",
                          )}
                        />
                        {PRODUCT_SORT_LABELS[option]}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[1.65px] text-sage">
                    Size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          pushFilters({
                            size: filters.size === size ? null : size,
                          });
                          setOpenPanel(null);
                        }}
                        className={cn(
                          "flex size-10 items-center justify-center rounded-full border text-[11px]",
                          filters.size === size
                            ? "border-ink bg-ink text-white"
                            : "border-sage-light text-ink hover:border-ink",
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </section>

                {colorOptions.length > 0 && (
                  <section>
                    <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[1.65px] text-sage">
                      Color
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color.hex}
                          type="button"
                          aria-label={color.name ?? color.hex}
                          onClick={() => {
                            pushFilters({
                              color:
                                filters.color === color.hex ? null : color.hex,
                            });
                            setOpenPanel(null);
                          }}
                          className={cn(
                            "size-8 rounded-full border",
                            filters.color === color.hex &&
                              "ring-2 ring-ink ring-offset-2 ring-offset-cream",
                          )}
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                  </section>
                )}

                <button
                  type="button"
                  onClick={clearAll}
                  className="text-[11px] uppercase tracking-wider text-sage underline"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  swatch,
  onRemove,
}: {
  label: string;
  swatch?: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-cream px-3 py-1 text-[11px] font-medium text-ink">
      {swatch && (
        <span
          className="size-3 rounded-full border border-border"
          style={{ backgroundColor: swatch }}
        />
      )}
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove ${label}`}>
        <X className="size-3" />
      </button>
    </span>
  );
}
