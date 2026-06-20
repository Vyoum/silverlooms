import { SlidersHorizontal } from "lucide-react";
import type { Product } from "@/lib/types/product";
import { Container } from "@/components/layout/page-shell";
import { JewelleryProductCard } from "./jewellery-product-card";

interface JewelleryProductGridProps {
  products: Product[];
}

export function JewelleryProductGrid({ products }: JewelleryProductGridProps) {
  return (
    <section className="bg-[#1a1816] py-20">
      <Container>
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="font-serif text-[42px] font-light leading-[50.4px] text-cream">
            Curated Selection
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[rgba(228,226,221,0.7)]">
              Showing {products.length} items
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-[17px] py-[9px] text-[13px] font-medium uppercase tracking-[0.65px] text-cream"
            >
              Filter &amp; Sort
              <SlidersHorizontal className="size-3.5" />
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <p className="py-16 text-center text-cream-dark/70">No jewellery products yet.</p>
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
