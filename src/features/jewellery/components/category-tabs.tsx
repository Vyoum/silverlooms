"use client";

import Link from "next/link";
import {
  JEWELLERY_CATEGORY_OPTIONS,
  buildJewelleryCatalogHref,
  type JewelleryCatalogFilters,
} from "@/features/jewellery/lib/jewellery-filters";
import { Container } from "@/components/layout/page-shell";
import { cn } from "@/lib/utils";

const categoryTabs = [
  { label: "All Jewellery", category: null },
  ...JEWELLERY_CATEGORY_OPTIONS.map((option) => ({
    label: option.label,
    category: option.slug,
  })),
];

interface CategoryTabsProps {
  filters: JewelleryCatalogFilters;
}

export function CategoryTabs({ filters }: CategoryTabsProps) {
  return (
    <section className="border-b border-white/10 bg-ink/95 backdrop-blur-[4px]">
      <Container>
        <div className="flex gap-8 overflow-x-auto py-4">
          {categoryTabs.map((tab) => {
            const href = buildJewelleryCatalogHref({
              category: tab.category,
              material: filters.material,
            });
            const isActive = filters.category === tab.category;

            return (
              <Link
                key={tab.label}
                href={href}
                className={cn(
                  "shrink-0 px-1 pb-[18px] pt-1.5 text-[11px] font-medium uppercase tracking-[1.1px] transition-colors",
                  isActive
                    ? "border-b border-cream text-cream"
                    : "text-[#c1c7cf] hover:text-cream",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
