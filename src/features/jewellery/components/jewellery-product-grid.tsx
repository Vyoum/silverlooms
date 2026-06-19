import { SlidersHorizontal } from "lucide-react";
import { jewelleryProducts } from "@/lib/constants/products";
import { Container } from "@/components/layout/page-shell";
import { JewelleryProductCard } from "./jewellery-product-card";

export function JewelleryProductGrid() {
  return (
    <section className="bg-[#1a1816] py-20">
      <Container>
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="font-serif text-[42px] font-light text-cream">
            Curated Selection
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-cream-dark/70">
              Showing {jewelleryProducts.length} items
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[13px] uppercase tracking-wider text-cream"
            >
              Filter &amp; Sort
              <SlidersHorizontal className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {jewelleryProducts.map((product) => (
            <JewelleryProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            className="rounded-full border border-muted-light px-8 py-3 text-[13px] uppercase tracking-[1.3px] text-cream transition-colors hover:border-cream"
          >
            Load More Pieces
          </button>
        </div>
      </Container>
    </section>
  );
}
