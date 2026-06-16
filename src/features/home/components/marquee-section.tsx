import { categoryMarquee } from "@/lib/constants/navigation";

export function MarqueeSection() {
  const items = [...categoryMarquee, ...categoryMarquee];

  return (
    <section className="overflow-hidden border-y border-border bg-cream-dark py-4">
      <div className="flex animate-marquee gap-12 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
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
