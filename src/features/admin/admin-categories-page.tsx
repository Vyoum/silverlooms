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
          Edit all storefront categories — apparel (Leheriya, Bandhej, Shirts, Bags, etc.)
          and jewellery (Necklace Sets, Earrings, Silver Jewellery, and more). Update names,
          keywords, marquee/filter visibility, sort order, and hero banners.
        </p>
      </div>
      <CategoriesManager categories={categories} catalogHeroes={catalogHeroes} />
    </div>
  );
}
