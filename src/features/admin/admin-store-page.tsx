import { listAdminProducts } from "@/features/admin/services/analytics-service";
import type { ProductType } from "@/features/admin/lib/product-presets";
import { AddProductForm } from "./components/add-product-form";
import { ProductsTable } from "./components/products-table";

interface AdminStorePageProps {
  defaultProductType?: ProductType;
  title?: string;
  description?: string;
  storefrontHref?: string;
  storefrontLabel?: string;
}

export async function AdminStorePage({
  defaultProductType = "apparel",
  title = "Apparel Store",
  description = "Add kurtis and apparel — they appear instantly on /kurtis.",
  storefrontHref = "/kurtis",
  storefrontLabel = "View /kurtis",
}: AdminStorePageProps) {
  const products = await listAdminProducts();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-admin-ink">{title}</h1>
          <p className="mt-2 text-sm text-admin-muted">{description}</p>
        </div>
        <a
          href={storefrontHref}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-admin-border px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-admin-muted transition-colors hover:border-admin-primary hover:text-admin-primary"
        >
          {storefrontLabel} →
        </a>
      </div>

      <AddProductForm defaultProductType={defaultProductType} />
      <ProductsTable
        products={products}
        defaultFilter={defaultProductType}
        title={defaultProductType === "jewellery" ? "Jewellery Products" : "Apparel Products"}
      />
    </div>
  );
}
