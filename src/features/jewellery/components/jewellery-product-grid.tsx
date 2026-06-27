import type { Product } from "@/lib/types/product";
import type { JewelleryCatalogFilters } from "@/features/jewellery/lib/jewellery-filters";
import { Container } from "@/components/layout/page-shell";
import { JewelleryFilterMenu } from "./jewellery-filter-menu";
import { JewelleryProductCard } from "./jewellery-product-card";

interface JewelleryProductGridProps {
  products: Product[];
  filters: JewelleryCatalogFilters;
}

export function JewelleryProductGrid({ products, filters }: JewelleryProductGridProps) {
  return (
    <section className="bg-[#1a1816] py-20">
      <Container>
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="font-serif text-[42px] font-light leading-[50.4px] text-cream">
            Curated Selection
          </h2>
          <JewelleryFilterMenu filters={filters} productCount={products.length} />
        </div>

        {products.length === 0 ? (
          <p className="py-16 text-center text-cream-dark/70">
            {filters.category || filters.material
              ? "No pieces match these filters. Try another category or material."
              : "No jewellery products yet."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <JewelleryProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center pt-4">
          <button
            type="button"
            className="rounded-full border border-[#c1c7cf] px-[33px] py-[13px] text-[13px] font-medium uppercase tracking-[1.3px] text-cream transition-colors hover:border-cream hover:text-cream"
          >
            Load More Pieces
          </button>
        </div>
      </Container>
    </section>
  );
}
