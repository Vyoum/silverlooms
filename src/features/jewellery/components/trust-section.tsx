import { Container } from "@/components/layout/page-shell";

const trustItems = [
  {
    title: "Anti-Tarnish Coating",
    description: "German silver with a protective finish that keeps its lustre.",
  },
  {
    title: "Handcrafted in Jaipur",
    description: "Each piece is made by skilled artisans using traditional techniques.",
  },
  {
    title: "Free Returns",
    description: "30-day hassle-free returns on all jewellery orders.",
  },
];

export function TrustSection() {
  return (
    <section className="border-t border-border bg-cream-dark py-16">
      <Container>
        <div className="grid gap-8 md:grid-cols-3">
          {trustItems.map((item) => (
            <div key={item.title} className="text-center">
              <h3 className="mb-2 font-serif text-xl text-ink">{item.title}</h3>
              <p className="text-sm leading-relaxed text-sage">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
