import { CategoriesManager } from "@/features/admin/components/categories-manager";
import {
  listStoreCategories,
} from "@/features/catalog/services/category-service";
import { getApparelCatalogHeroes } from "@/lib/site-content/catalog-hero";

export async function AdminCategoriesPage() {
  const [categories, catalogHeroes] = await Promise.all([
    listStoreCategories(),
    getApparelCatalogHeroes(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-medium text-admin-ink">Categories</h1>
        <p className="mt-2 max-w-2xl text-sm text-admin-muted">
          Manage storefront categories, catalog banner photos on /kurtis, and per-category
          hero backgrounds when customers filter by Leheriya, Bandhej, Shirts, Bags, and more.
        </p>
      </div>
      <CategoriesManager categories={categories} catalogHeroes={catalogHeroes} />
    </div>
  );
}
