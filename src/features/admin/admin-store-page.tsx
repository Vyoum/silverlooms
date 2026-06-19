import { listAdminProducts } from "@/features/admin/services/analytics-service";
import { AddProductForm } from "./components/add-product-form";
import { ProductsTable } from "./components/products-table";

export async function AdminStorePage() {
  const products = await listAdminProducts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-medium text-admin-ink">Store</h1>
        <p className="mt-2 text-sm text-admin-muted">
          Add products here — they appear instantly on the website.
        </p>
      </div>

      <AddProductForm />
      <ProductsTable products={products} />
    </div>
  );
}
