"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import {
  createCategoryAction,
  deleteCategoryFormAction,
  type CategoryActionResult,
} from "@/features/admin/actions/category-actions";
import type { StoreCategory } from "@/features/catalog/lib/store-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: CategoryActionResult = { success: false };

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
      {children}
    </label>
  );
}

export function CategoriesManager({ categories }: { categories: StoreCategory[] }) {
  const [state, formAction, pending] = useActionState(
    createCategoryAction,
    initialState,
  );

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-admin-border bg-admin-surface p-6">
        <div className="mb-6">
          <h2 className="font-serif text-xl font-medium text-admin-ink">Add Category</h2>
          <p className="mt-1 text-sm text-admin-muted">
            New categories appear in the homepage marquee, apparel filters, and
            product forms. Use keywords to match existing product labels (e.g.
            &quot;shirt&quot; for Shirts).
          </p>
        </div>

        <form action={formAction} className="grid gap-4 lg:grid-cols-2">
          <div>
            <FieldLabel>Name</FieldLabel>
            <Input name="name" placeholder="Shirts" required />
          </div>
          <div>
            <FieldLabel>Type</FieldLabel>
            <select
              name="kind"
              defaultValue="APPAREL"
              className="h-10 w-full rounded-lg border border-admin-border bg-white px-3 text-sm text-admin-ink outline-none focus:border-admin-primary"
            >
              <option value="APPAREL">Apparel</option>
              <option value="JEWELLERY">Jewellery</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <FieldLabel>Match Keywords (comma-separated)</FieldLabel>
            <Input
              name="keywords"
              placeholder="shirt, shirts, top"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-admin-ink">
            <input type="checkbox" name="showInMarquee" defaultChecked />
            Show in homepage marquee
          </label>
          <label className="flex items-center gap-2 text-sm text-admin-ink">
            <input type="checkbox" name="showInCatalogFilter" defaultChecked />
            Show in apparel category filter
          </label>
          <div className="lg:col-span-2 flex items-center gap-4">
            <Button type="submit" disabled={pending}>
              {pending ? "Adding…" : "Add Category"}
            </Button>
            {state.success ? (
              <p className="text-sm text-emerald-700">Category added.</p>
            ) : null}
            {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-admin-border bg-admin-surface overflow-hidden">
        <div className="border-b border-admin-border px-6 py-4">
          <h2 className="font-serif text-xl font-medium text-admin-ink">
            Current Categories
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-admin-canvas text-left text-[11px] uppercase tracking-wider text-admin-muted">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Keywords</th>
                <th className="px-6 py-3 font-medium">Marquee</th>
                <th className="px-6 py-3 font-medium">Filter</th>
                <th className="px-6 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-t border-admin-border">
                  <td className="px-6 py-4 font-medium text-admin-ink">{category.name}</td>
                  <td className="px-6 py-4 text-admin-muted">
                    {category.kind === "APPAREL" ? "Apparel" : "Jewellery"}
                  </td>
                  <td className="px-6 py-4 text-admin-muted">
                    {category.keywords.join(", ") || category.name.toLowerCase()}
                  </td>
                  <td className="px-6 py-4 text-admin-muted">
                    {category.showInMarquee ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 text-admin-muted">
                    {category.showInCatalogFilter ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={deleteCategoryFormAction}>
                      <input type="hidden" name="id" value={category.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
