"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import {
  createCategoryAction,
  deleteCategoryFormAction,
  type CategoryActionResult,
} from "@/features/admin/actions/category-actions";
import { CatalogHeroManager } from "@/features/admin/components/catalog-hero-manager";
import { CategoryEditor } from "@/features/admin/components/category-editor";
import {
  CategoryKind,
  type StoreCategory,
} from "@/features/catalog/lib/store-categories";
import type { ApparelCatalogHeroes } from "@/lib/site-content/catalog-hero";
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

function CategoryTable({
  title,
  description,
  categories,
}: {
  title: string;
  description: string;
  categories: StoreCategory[];
}) {
  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface overflow-hidden">
      <div className="border-b border-admin-border px-6 py-4">
        <h2 className="font-serif text-xl font-medium text-admin-ink">{title}</h2>
        <p className="mt-1 text-sm text-admin-muted">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-admin-canvas text-left text-[11px] uppercase tracking-wider text-admin-muted">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Keywords</th>
              <th className="px-6 py-3 font-medium">Order</th>
              <th className="px-6 py-3 font-medium">Marquee</th>
              <th className="px-6 py-3 font-medium">Filter</th>
              <th className="px-6 py-3 font-medium">Hero</th>
              <th className="px-6 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-admin-muted">
                  No categories in this group yet.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-t border-admin-border align-top">
                  <td className="px-6 py-4 font-medium text-admin-ink">{category.name}</td>
                  <td className="px-6 py-4 text-admin-muted">
                    {category.keywords.join(", ") || category.name.toLowerCase()}
                  </td>
                  <td className="px-6 py-4 text-admin-muted">{category.sortOrder}</td>
                  <td className="px-6 py-4 text-admin-muted">
                    {category.showInMarquee ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 text-admin-muted">
                    {category.showInCatalogFilter ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4">
                    <CategoryEditor category={category} />
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function CategoriesManager({
  categories,
  catalogHeroes,
}: {
  categories: StoreCategory[];
  catalogHeroes: ApparelCatalogHeroes;
}) {
  const [state, formAction, pending] = useActionState(
    createCategoryAction,
    initialState,
  );

  const apparelCategories = categories.filter(
    (category) => category.kind === CategoryKind.APPAREL,
  );
  const jewelleryCategories = categories.filter(
    (category) => category.kind === CategoryKind.JEWELLERY,
  );

  return (
    <div className="space-y-8">
      <CatalogHeroManager heroes={catalogHeroes} />

      <section className="rounded-2xl border border-admin-border bg-admin-surface p-6">
        <div className="mb-6">
          <h2 className="font-serif text-xl font-medium text-admin-ink">Add Category</h2>
          <p className="mt-1 text-sm text-admin-muted">
            New categories appear in the homepage marquee, catalog filters, and
            product forms. You can also set a hero banner for when customers filter
            by that category on /kurtis.
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
            <Input name="keywords" placeholder="shirt, shirts, top" />
          </div>
          <div>
            <FieldLabel>Hero title (optional)</FieldLabel>
            <Input name="heroTitle" placeholder="Shirts" />
          </div>
          <div>
            <FieldLabel>Hero subtitle (optional)</FieldLabel>
            <Input name="heroSubtitle" placeholder="Everyday cotton & linen shirts" />
          </div>
          <div className="lg:col-span-2">
            <FieldLabel>Category hero background (optional)</FieldLabel>
            <Input
              name="heroImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-admin-ink">
            <input type="checkbox" name="showInMarquee" defaultChecked />
            Show in homepage marquee
          </label>
          <label className="flex items-center gap-2 text-sm text-admin-ink">
            <input type="checkbox" name="showInCatalogFilter" defaultChecked />
            Show in catalog filter
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

      <CategoryTable
        title="Apparel Categories"
        description="Kurti Sets, Leheriya, Bandhej, Shirts, Bags, and all other apparel filters on /kurtis."
        categories={apparelCategories}
      />

      <CategoryTable
        title="Jewellery Categories"
        description="German Silver, Necklace Sets, Earrings, and other jewellery groupings."
        categories={jewelleryCategories}
      />
    </div>
  );
}
