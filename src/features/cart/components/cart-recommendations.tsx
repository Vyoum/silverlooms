import { ProductCard } from "@/components/shared/product-card";
import { kurtisProducts } from "@/lib/constants/products";
import { Container } from "@/components/layout/page-shell";

export function CartRecommendations() {
  const recommendations = kurtisProducts.slice(0, 4);

  return (
    <section className="border-t border-border py-16">
      <Container>
        <h2 className="mb-10 font-serif text-[42px] font-light text-ink">
          You Might Also Like
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
