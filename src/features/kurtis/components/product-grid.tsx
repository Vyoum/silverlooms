import { ProductCard } from "@/components/shared/product-card";
import { Pagination } from "@/components/shared/pagination";
import type { Product } from "@/lib/types/product";

interface KurtisProductGridProps {
  products: Product[];
}

export function KurtisProductGrid({ products }: KurtisProductGridProps) {
  return (
    <div className="flex-1">
      {products.length === 0 ? (
        <p className="py-16 text-center text-sage">No apparel products yet.</p>
      ) : (
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <Pagination className="mt-16" />
    </div>
  );
}
