import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { listRelatedProducts } from "@/features/catalog/services/product-service";

interface RelatedProductsProps {
  currentSlug: string;
}

export async function RelatedProducts({ currentSlug }: RelatedProductsProps) {
  const related = await listRelatedProducts(currentSlug, 4);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-border py-16">
      <SectionHeading title="You May Also Like" className="mb-10" />
      <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
