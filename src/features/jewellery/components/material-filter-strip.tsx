"use client";

import Link from "next/link";
import {
  JEWELLERY_MATERIAL_OPTIONS,
  buildJewelleryCatalogHref,
  type JewelleryCatalogFilters,
} from "@/features/jewellery/lib/jewellery-filters";
import { Container } from "@/components/layout/page-shell";
import { cn } from "@/lib/utils";

interface MaterialFilterStripProps {
  filters: JewelleryCatalogFilters;
}

export function MaterialFilterStrip({ filters }: MaterialFilterStripProps) {
  return (
    <section className="border-b border-white/10 bg-ink py-8">
      <Container>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {JEWELLERY_MATERIAL_OPTIONS.map((option) => {
            const isActive = filters.material === option.slug;
            const href = buildJewelleryCatalogHref({
              category: filters.category,
              material: isActive ? null : option.slug,
            });

            return (
              <Link
                key={option.slug}
                href={href}
                className={cn(
                  "w-48 shrink-0 rounded border px-[17px] py-[17px] text-left text-[11px] font-medium uppercase tracking-[1.65px] transition-colors",
                  isActive
                    ? "border-cream bg-white/10 text-cream"
                    : "border-white/10 text-cream hover:border-white/30",
                )}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
