"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProductAction } from "@/features/admin/actions";
import type { AdminProductRow } from "@/features/admin/types";

interface ProductsTableProps {
  products: AdminProductRow[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <article className="rounded-2xl border border-admin-border bg-admin-surface p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-medium text-admin-ink">
          Store Products
        </h2>
        <span className="text-sm text-admin-muted">{products.length} live</span>
      </div>

      {products.length === 0 ? (
        <p className="py-8 text-center text-sm text-admin-muted">
          No products yet. Add your first product above.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-admin-border text-[11px] uppercase tracking-wider text-admin-muted">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Added</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
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
                  <td className="py-4 text-admin-muted">{product.categoryLabel}</td>
                  <td className="py-4 text-admin-ink">
                    ₹{product.price.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 text-admin-muted">{product.stock}</td>
                  <td className="py-4 text-admin-muted">{product.createdAt}</td>
                  <td className="py-4 text-right">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}
