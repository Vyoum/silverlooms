import { Container } from "@/components/layout/page-shell";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { homeNewArrivals } from "@/lib/constants/products";

export function NewArrivalsSection() {
  return (
    <section className="border-b border-border py-20">
      <Container>
        <SectionHeading
          title="New Arrivals"
          subtitle="Fresh from our Jaipur atelier — limited pieces crafted with care."
          className="mb-12"
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {homeNewArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href="/kurtis"
            className="rounded-full border border-border px-6 py-2 text-[11px] uppercase tracking-[1.1px] transition-colors hover:bg-cream-dark"
          >
            View All Products
          </a>
          <a
            href="/kurtis?sort=new"
            className="rounded-full border border-border px-6 py-2 text-[11px] uppercase tracking-[1.1px] transition-colors hover:bg-cream-dark"
          >
            New Arrivals
          </a>
          <a
            href="/kurtis?sort=bestseller"
            className="rounded-full border border-border px-6 py-2 text-[11px] uppercase tracking-[1.1px] transition-colors hover:bg-cream-dark"
          >
            Best Sellers
          </a>
        </div>
      </Container>
    </section>
  );
}
