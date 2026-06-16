import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { kurtisProducts } from "@/lib/constants/products";
import type { Product } from "@/lib/types/product";

interface RelatedProductsProps {
  currentProduct: Product;
}

export function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  const related = kurtisProducts
    .filter((p) => p.id !== currentProduct.id)
    .slice(0, 4);

  return (
    <section className="border-t border-border py-16">
      <SectionHeading title="You May Also Like" className="mb-10" />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
