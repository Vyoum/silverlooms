import { ProductCard } from "@/components/shared/product-card";
import { jewelleryProducts } from "@/lib/constants/products";
import { Container } from "@/components/layout/page-shell";

export function JewelleryProductGrid() {
  return (
    <section className="py-16">
      <Container>
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="font-serif text-[42px] font-light text-ink">
            Our Collection
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-sage">
              {jewelleryProducts.length} pieces
            </span>
            <select className="rounded-full border border-border bg-cream px-4 py-2 text-[11px] uppercase tracking-wider">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {jewelleryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
