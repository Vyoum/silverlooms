import { CategoriesManager } from "@/features/admin/components/categories-manager";
import { listStoreCategories } from "@/features/catalog/services/category-service";

export async function AdminCategoriesPage() {
  const categories = await listStoreCategories();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-medium text-admin-ink">Categories</h1>
        <p className="mt-2 max-w-2xl text-sm text-admin-muted">
          Manage storefront categories like Leheriya, Bandhej, Shirts, Bags, and
          Silver Jewellery. They appear in the homepage marquee, apparel filters,
          and mobile navigation.
        </p>
      </div>
      <CategoriesManager categories={categories} />
    </div>
  );
}
