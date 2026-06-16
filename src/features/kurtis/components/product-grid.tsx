import { ProductCard } from "@/components/shared/product-card";
import { Pagination } from "@/components/shared/pagination";
import { kurtisProducts } from "@/lib/constants/products";

export function KurtisProductGrid() {
  return (
    <div className="flex-1">
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {kurtisProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination className="mt-16" />
    </div>
  );
}
