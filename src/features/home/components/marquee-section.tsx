import Link from "next/link";
import {
  fallbackMarqueeCategories,
  type MarqueeCategoryItem,
} from "@/features/catalog/lib/category-href";

interface MarqueeSectionProps {
  items?: MarqueeCategoryItem[];
}

export function MarqueeSection({
  items = fallbackMarqueeCategories(),
}: MarqueeSectionProps) {
  const marqueeItems = items.length > 0 ? items : fallbackMarqueeCategories();
  const loop = [...marqueeItems, ...marqueeItems];

  return (
    <section className="overflow-hidden border-y border-border bg-cream-dark py-4">
      <div className="flex animate-marquee gap-12 whitespace-nowrap">
        {loop.map((item, i) => (
          <span key={`${item.href}-${item.label}-${i}`} className="flex items-center gap-12">
            <Link
              href={item.href}
              className="text-[11px] font-medium uppercase tracking-[2.2px] text-ink transition-colors hover:text-forest"
            >
              {item.label}
            </Link>
            <span className="text-[11px] text-border" aria-hidden>
              •
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
