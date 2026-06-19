"use client";

import { jewelleryCategoryTabs } from "@/lib/constants/navigation";
import { Container } from "@/components/layout/page-shell";
import { cn } from "@/lib/utils";

export function CategoryTabs() {
  return (
    <section className="border-b border-white/10 bg-ink/95 backdrop-blur-[4px]">
      <Container>
        <div className="flex gap-8 overflow-x-auto py-4">
          {jewelleryCategoryTabs.map((cat, i) => (
            <button
              key={cat}
              type="button"
              className={cn(
                "shrink-0 px-1 pb-[18px] pt-1.5 text-[11px] font-medium uppercase tracking-[1.1px] transition-colors",
                i === 0
                  ? "border-b border-cream text-cream"
                  : "text-[#c1c7cf] hover:text-cream",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
