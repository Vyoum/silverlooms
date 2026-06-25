import { Suspense } from "react";
import { CategoryKind } from "@/features/catalog/lib/store-categories";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, PageShell } from "@/components/layout/page-shell";
import {
  getCategoryBySlug,
  listCatalogFilterCategories,
} from "@/features/catalog/services/category-service";
import { toCatalogCategoryOptions } from "@/features/kurtis/lib/kurtis-filters";
import { listCatalogProducts } from "@/features/catalog/services/product-service";
import {
  applyKurtisCatalogFilters,
  parseKurtisCatalogFilters,
} from "@/features/kurtis/lib/kurtis-filters";
import {
  getApparelCatalogHeroes,
  type CatalogHeroContent,
} from "@/lib/site-content/catalog-hero";
import { ActiveFilters } from "./components/active-filters";
import { CategoryHero } from "./components/category-hero";
import { KurtisCatalogSection } from "./components/kurtis-catalog-section";
import { KurtisFooter } from "./components/kurtis-footer";

interface KurtisPageProps {
  searchParams: {
    sort?: string;
    category?: string;
    size?: string;
    color?: string;
  };
}

function resolveCategoryHero(
  category: Awaited<ReturnType<typeof getCategoryBySlug>>,
  fallback: CatalogHeroContent,
): CatalogHeroContent {
  if (!category) return fallback;

  return {
    eyebrow: category.name,
    title: category.heroTitle ?? category.name,
    subtitle:
      category.heroSubtitle ??
      `Curated ${category.name.toLowerCase()} pieces from our Jaipur atelier`,
    imageUrl: category.heroImageUrl ?? fallback.imageUrl,
  };
}

export async function KurtisPage({ searchParams }: KurtisPageProps) {
  const [apparelCategories, catalogHeroes] = await Promise.all([
    listCatalogFilterCategories(CategoryKind.APPAREL),
    getApparelCatalogHeroes(),
  ]);
  const categoryOptions = toCatalogCategoryOptions(apparelCategories);
  const filters = parseKurtisCatalogFilters(searchParams, categoryOptions);
  const baseProducts = await listCatalogProducts(filters.sort);
  const products = applyKurtisCatalogFilters(baseProducts, filters, categoryOptions);

  const sortHero = catalogHeroes[filters.sort];
  const selectedCategory = filters.category
    ? await getCategoryBySlug(filters.category)
    : null;
  const hero = selectedCategory
    ? resolveCategoryHero(selectedCategory, sortHero)
    : sortHero;

  return (
    <PageShell>
      <SiteHeader />
      <main>
        <CategoryHero hero={hero} className="-mt-32 pt-32" />
        <Suspense fallback={null}>
          <ActiveFilters
            filters={filters}
            productCount={products.length}
            categoryOptions={categoryOptions}
          />
        </Suspense>
        <Container>
          <Suspense fallback={<div className="py-12 text-center text-sage">Loading…</div>}>
            <KurtisCatalogSection
              products={products}
              baseProducts={baseProducts}
              filters={filters}
              categoryOptions={categoryOptions}
            />
          </Suspense>
        </Container>
      </main>
      <KurtisFooter />
    </PageShell>
  );
}
