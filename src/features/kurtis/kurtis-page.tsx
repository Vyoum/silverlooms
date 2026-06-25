import { Suspense } from "react";
import { CategoryKind } from "@/features/catalog/lib/store-categories";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, PageShell } from "@/components/layout/page-shell";
import { listCatalogFilterCategories } from "@/features/catalog/services/category-service";
import { toCatalogCategoryOptions } from "@/features/kurtis/lib/kurtis-filters";
import { listCatalogProducts } from "@/features/catalog/services/product-service";
import {
  applyKurtisCatalogFilters,
  parseKurtisCatalogFilters,
} from "@/features/kurtis/lib/kurtis-filters";
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

export async function KurtisPage({ searchParams }: KurtisPageProps) {
  const apparelCategories = await listCatalogFilterCategories(CategoryKind.APPAREL);
  const categoryOptions = toCatalogCategoryOptions(apparelCategories);
  const filters = parseKurtisCatalogFilters(searchParams, categoryOptions);
  const baseProducts = await listCatalogProducts(filters.sort);
  const products = applyKurtisCatalogFilters(baseProducts, filters, categoryOptions);

  return (
    <PageShell>
      <SiteHeader />
      <main>
        <CategoryHero sort={filters.sort} className="-mt-20 pt-20" />
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
