"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import {
  JEWELLERY_CATEGORY_OPTIONS,
  JEWELLERY_MATERIAL_OPTIONS,
  buildJewelleryCatalogHref,
  getJewelleryCategoryLabel,
  getJewelleryMaterialLabel,
  type JewelleryCatalogFilters,
} from "@/features/jewellery/lib/jewellery-filters";
import {
  PRICE_SORT_LABELS,
  PRICE_SORT_OPTIONS,
} from "@/features/catalog/lib/price-sort";
import { cn } from "@/lib/utils";

interface JewelleryFilterMenuProps {
  filters: JewelleryCatalogFilters;
  productCount: number;
}

export function JewelleryFilterMenu({ filters, productCount }: JewelleryFilterMenuProps) {
  const [open, setOpen] = useState(false);
  const hasActiveFilters = Boolean(filters.category || filters.material || filters.price);

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        <span className="text-sm text-[rgba(228,226,221,0.7)]">
          Showing {productCount} items
        </span>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.5px] sm:gap-2 sm:px-[17px] sm:py-[9px] sm:text-[13px] sm:tracking-[0.65px]",
            open || hasActiveFilters
              ? "border-cream bg-white/10 text-cream"
              : "border-white/20 text-cream",
          )}
        >
          Filter &amp; Sort
          <SlidersHorizontal className="size-3 sm:size-3.5" />
        </button>
      </div>

      {open ? (
        <div className="absolute right-0 z-20 mt-3 w-[min(100vw-2rem,360px)] rounded-2xl border border-white/10 bg-[#1f1c18] p-5 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-[1.1px] text-cream">
              Filters
            </p>
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setOpen(false)}
              className="text-cream-dark hover:text-cream"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[1.65px] text-cream-dark">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  href={buildJewelleryCatalogHref({ material: filters.material, price: filters.price })}
                  active={!filters.category}
                  label="All"
                  onNavigate={() => setOpen(false)}
                />
                {JEWELLERY_CATEGORY_OPTIONS.map((option) => (
                  <FilterChip
                    key={option.slug}
                    href={buildJewelleryCatalogHref({
                      category: option.slug,
                      material: filters.material,
                      price: filters.price,
                    })}
                    active={filters.category === option.slug}
                    label={option.label}
                    onNavigate={() => setOpen(false)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[1.65px] text-cream-dark">
                Material
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  href={buildJewelleryCatalogHref({ category: filters.category, price: filters.price })}
                  active={!filters.material}
                  label="All"
                  onNavigate={() => setOpen(false)}
                />
                {JEWELLERY_MATERIAL_OPTIONS.map((option) => (
                  <FilterChip
                    key={option.slug}
                    href={buildJewelleryCatalogHref({
                      category: filters.category,
                      material: option.slug,
                      price: filters.price,
                    })}
                    active={filters.material === option.slug}
                    label={option.label}
                    onNavigate={() => setOpen(false)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[1.65px] text-cream-dark">
                Price
              </p>
              <div className="flex flex-wrap gap-2">
                {PRICE_SORT_OPTIONS.map((option) => (
                  <FilterChip
                    key={option}
                    href={buildJewelleryCatalogHref({
                      category: filters.category,
                      material: filters.material,
                      price: filters.price === option ? null : option,
                    })}
                    active={filters.price === option}
                    label={PRICE_SORT_LABELS[option]}
                    onNavigate={() => setOpen(false)}
                  />
                ))}
              </div>
            </div>
          </div>

          {hasActiveFilters ? (
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="mb-3 text-[10px] uppercase tracking-[1.65px] text-cream-dark">
                Active
              </p>
              <div className="flex flex-wrap gap-2">
                {filters.category ? (
                  <FilterChip
                    href={buildJewelleryCatalogHref({ material: filters.material, price: filters.price })}
                    active
                    label={getJewelleryCategoryLabel(filters.category) ?? "Category"}
                    onNavigate={() => setOpen(false)}
                  />
                ) : null}
                {filters.material ? (
                  <FilterChip
                    href={buildJewelleryCatalogHref({ category: filters.category, price: filters.price })}
                    active
                    label={getJewelleryMaterialLabel(filters.material) ?? "Material"}
                    onNavigate={() => setOpen(false)}
                  />
                ) : null}
                {filters.price ? (
                  <FilterChip
                    href={buildJewelleryCatalogHref({
                      category: filters.category,
                      material: filters.material,
                    })}
                    active
                    label={PRICE_SORT_LABELS[filters.price]}
                    onNavigate={() => setOpen(false)}
                  />
                ) : null}
              </div>
              <Link
                href="/jewellery"
                onClick={() => setOpen(false)}
                className="mt-4 inline-block text-[11px] uppercase tracking-wider text-cream-dark underline-offset-2 hover:text-cream hover:underline"
              >
                Clear all filters
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function FilterChip({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.08em] transition-colors",
        active
          ? "border-cream bg-white/10 text-cream"
          : "border-white/15 text-cream-dark hover:border-white/30 hover:text-cream",
      )}
    >
      {label}
    </Link>
  );
}
