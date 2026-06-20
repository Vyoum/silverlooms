"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProductAction } from "@/features/admin/actions";
import { ProductInventoryEditor } from "@/features/admin/components/product-inventory-editor";
import type { ProductType } from "@/features/admin/lib/product-presets";
import type { AdminProductRow } from "@/features/admin/types";
import { cn } from "@/lib/utils";

interface ProductsTableProps {
  products: AdminProductRow[];
  defaultFilter?: ProductType | "all";
  title?: string;
}

const filters: { id: ProductType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "apparel", label: "Apparel" },
  { id: "jewellery", label: "Jewellery" },
];

export function ProductsTable({
  products,
  defaultFilter = "all",
  title = "Store Products",
}: ProductsTableProps) {
  const [filter, setFilter] = useState<ProductType | "all">(defaultFilter);
  const [pending, startTransition] = useTransition();
  const [editingProduct, setEditingProduct] = useState<AdminProductRow | null>(
    null,
  );
  const router = useRouter();

  const filtered = useMemo(
    () =>
      filter === "all"
        ? products
        : products.filter((product) => product.productType === filter),
    [filter, products],
  );

  return (
    <article className="rounded-2xl border border-admin-border bg-admin-surface p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-serif text-2xl font-medium text-admin-ink">{title}</h2>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-admin-border p-0.5">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={cn(
                  "rounded-md px-3 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors",
                  filter === item.id
                    ? "bg-admin-primary text-white"
                    : "text-admin-muted hover:text-admin-ink",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <span className="text-sm text-admin-muted">{filtered.length} live</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-admin-muted">
          No {filter === "all" ? "" : filter} products yet. Add your first product above.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-admin-border text-[11px] uppercase tracking-wider text-admin-muted">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Added</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-admin-border/60 last:border-0"
                >
                  <td className="py-4">
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-medium text-admin-ink hover:text-admin-primary"
                      target="_blank"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="py-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                        product.productType === "jewellery"
                          ? "bg-[#1c1a16] text-gold"
                          : "bg-admin-primary/10 text-admin-primary",
                      )}
                    >
                      {product.productType}
                    </span>
                  </td>
                  <td className="py-4 text-admin-muted">{product.categoryLabel}</td>
                  <td className="py-4 text-admin-ink">
                    ₹{product.price.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 text-admin-muted">{product.stock}</td>
                  <td className="py-4 text-admin-muted">{product.createdAt}</td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(product)}
                        className="text-[11px] font-medium uppercase tracking-wider text-admin-primary hover:underline"
                      >
                        Stock
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() =>
                          startTransition(async () => {
                            await deleteProductAction(product.id);
                            router.refresh();
                          })
                        }
                        className="text-[11px] font-medium uppercase tracking-wider text-admin-error hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editingProduct && (
        <ProductInventoryEditor
          productId={editingProduct.id}
          productName={editingProduct.name}
          onClose={() => setEditingProduct(null)}
          onSaved={() => router.refresh()}
        />
      )}
    </article>
  );
}
