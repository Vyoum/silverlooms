import { Award, Gift, Shield } from "lucide-react";
import { Container } from "@/components/layout/page-shell";

const trustItems = [
  {
    icon: Award,
    title: "German Silver",
    description:
      "Artisan-crafted german silver pieces with lasting shine, durability, and timeless appeal.",
  },
  {
    icon: Shield,
    title: "Anti-tarnish Coating",
    description:
      "Every piece is treated with an invisible layer to preserve its pristine silver luster.",
  },
  {
    icon: Gift,
    title: "Signature Gifting",
    description:
      "Arrives in our bespoke Obsidian and Ivory boxes, ready to delight.",
  },
];

export function TrustSection() {
  return (
    <section className="border-y border-white/10 bg-ink py-16 md:py-[65px]">
      <Container>
        <div className="grid gap-12 md:grid-cols-3 md:gap-12">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={index > 0 ? "md:border-l md:border-white/10 md:pl-12" : ""}
              >
                <Icon className="mb-4 size-5 text-gold" strokeWidth={1.25} />
                <h3 className="mb-2 font-serif text-xl leading-7 text-cream">
                  {item.title}
                </h3>
                <p className="max-w-xs text-sm leading-[1.5] text-[rgba(228,226,221,0.7)]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
