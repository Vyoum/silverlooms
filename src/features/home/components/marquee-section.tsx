import { categoryMarquee as fallbackMarquee } from "@/lib/constants/navigation";

interface MarqueeSectionProps {
  items?: string[];
}

export function MarqueeSection({ items = [...fallbackMarquee] }: MarqueeSectionProps) {
  const marqueeItems = items.length > 0 ? items : [...fallbackMarquee];
  const loop = [...marqueeItems, ...marqueeItems];

  return (
    <section className="overflow-hidden border-y border-border bg-cream-dark py-4">
      <div className="flex animate-marquee gap-12 whitespace-nowrap">
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-12">
            <span className="text-[11px] font-medium uppercase tracking-[2.2px] text-ink">
              {item}
            </span>
            <span className="text-[11px] text-border">•</span>
          </span>
        ))}
      </div>
    </section>
  );
}
