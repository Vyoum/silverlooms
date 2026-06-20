import { ProductCard } from "@/components/shared/product-card";
import { Pagination } from "@/components/shared/pagination";
import type { ProductSort } from "@/features/catalog/lib/product-sort";
import type { Product } from "@/lib/types/product";

interface KurtisProductGridProps {
  products: Product[];
  sort: ProductSort;
}

const emptyMessages: Record<ProductSort, string> = {
  all: "No apparel products yet.",
  bestseller: "No best sellers yet. Check back soon.",
  new: "No new arrivals yet. Check back soon.",
};

export function KurtisProductGrid({ products, sort }: KurtisProductGridProps) {
  return (
    <div className="flex-1">
      {products.length === 0 ? (
        <p className="py-16 text-center text-sage">{emptyMessages[sort]}</p>
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
