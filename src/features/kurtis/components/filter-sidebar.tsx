"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PRODUCT_SORT_LABELS,
  PRODUCT_SORT_OPTIONS,
  type ProductSort,
} from "@/features/catalog/lib/product-sort";
import { cn } from "@/lib/utils";

const categories = [
  { label: "Kurti Sets", count: 142, checked: true },
  { label: "Straight Kurtis", count: 88, checked: false },
  { label: "A-Line Kurtis", count: 64, checked: false },
];

const sizes = ["XS", "S", "M", "L", "XL"];
const colors = [
  { hex: "#e4beb7", selected: true },
  { hex: "#b0cfa3", selected: false },
  { hex: "#ffffff", selected: false },
  { hex: "#d9c9a8", selected: false },
  { hex: "#141210", selected: false },
  { hex: "#3b5998", selected: false },
];

interface FilterSidebarProps {
  sort: ProductSort;
}

export function FilterSidebar({ sort }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setSort = (nextSort: ProductSort) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextSort === "all") {
      params.delete("sort");
    } else {
      params.set("sort", nextSort);
    }

    const query = params.toString();
    router.push(query ? `/kurtis?${query}` : "/kurtis");
  };

  return (
    <aside className="w-full shrink-0 md:w-[220px]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[11px] font-medium uppercase tracking-[1.65px] text-ink">
          Filter
        </h2>
        <button
          type="button"
          className="text-[11px] text-sage-light"
          onClick={() => setSort("all")}
        >
          Reset
        </button>
      </div>

      <div className="space-y-3 border-b border-border pb-4">
        <h3 className="text-base font-medium text-ink">Collection</h3>
        <div className="space-y-2">
          {PRODUCT_SORT_OPTIONS.map((option) => {
            const selected = sort === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => setSort(option)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-1 py-1.5 text-left text-xs transition-colors",
                  selected ? "font-medium text-ink" : "text-sage hover:text-ink",
                )}
              >
                <span
                  className={cn(
                    "size-4 rounded-full border",
                    selected
                      ? "border-ink bg-ink ring-2 ring-ink ring-offset-2 ring-offset-cream"
                      : "border-sage-light",
                  )}
                  aria-hidden
                />
                {PRODUCT_SORT_LABELS[option]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6 border-b border-border py-4">
        <h3 className="text-base font-medium text-ink">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat.label}
              className="flex cursor-pointer items-center gap-3 text-xs text-sage"
            >
              <Checkbox defaultChecked={cat.checked} />
              {cat.label} ({cat.count})
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4 border-b border-border py-4">
        <h3 className="text-base font-medium text-ink">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={cn(
                "flex size-10 items-center justify-center rounded-full border text-[11px]",
                size === "M"
                  ? "border-ink bg-ink text-white"
                  : "border-sage-light text-ink hover:border-ink",
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 py-4">
        <h3 className="text-base font-medium text-ink">Color</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color, i) => (
            <button
              key={i}
              type="button"
              className={cn(
                "size-6 rounded-full border",
                color.selected && "ring-2 ring-ink ring-offset-2 ring-offset-cream",
              )}
              style={{ backgroundColor: color.hex }}
              aria-label={`Color ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
