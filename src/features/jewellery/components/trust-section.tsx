import { Container } from "@/components/layout/page-shell";

const trustItems = [
  {
    title: "92.5 Pure Silver",
    description:
      "Hallmarked quality guaranteeing purity, durability, and a lifetime of brilliance.",
  },
  {
    title: "Anti-tarnish Coating",
    description:
      "Every piece is treated with an invisible layer to preserve its pristine silver luster.",
  },
  {
    title: "Signature Gifting",
    description:
      "Arrives in our bespoke Obsidian and Ivory boxes, ready to delight.",
  },
];

export function TrustSection() {
  return (
    <section className="border-y border-white/10 bg-ink py-16">
      <Container>
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className={index > 0 ? "md:border-l md:border-white/10 md:pl-12" : ""}
            >
              <h3 className="mb-2 font-serif text-xl text-cream">{item.title}</h3>
              <p className="text-sm leading-relaxed text-cream-dark/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
