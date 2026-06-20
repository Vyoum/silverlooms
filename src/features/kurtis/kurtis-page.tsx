import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, PageShell } from "@/components/layout/page-shell";
import { listCatalogProducts } from "@/features/catalog/services/product-service";
import type { KurtisCatalogFilters } from "@/features/kurtis/lib/kurtis-filters";
import {
  applyKurtisCatalogFilters,
} from "@/features/kurtis/lib/kurtis-filters";
import { ActiveFilters } from "./components/active-filters";
import { CategoryHero } from "./components/category-hero";
import { KurtisCatalogSection } from "./components/kurtis-catalog-section";
import { KurtisFooter } from "./components/kurtis-footer";

interface KurtisPageProps {
  filters: KurtisCatalogFilters;
}

export async function KurtisPage({ filters }: KurtisPageProps) {
  const baseProducts = await listCatalogProducts(filters.sort);
  const products = applyKurtisCatalogFilters(baseProducts, filters);

  return (
    <PageShell>
      <SiteHeader />
      <main>
        <CategoryHero sort={filters.sort} className="-mt-20 pt-20" />
        <Suspense fallback={null}>
          <ActiveFilters filters={filters} productCount={products.length} />
        </Suspense>
        <Container>
          <Suspense fallback={<div className="py-12 text-center text-sage">Loading…</div>}>
            <KurtisCatalogSection
              products={products}
              baseProducts={baseProducts}
              filters={filters}
            />
          </Suspense>
        </Container>
      </main>
      <KurtisFooter />
    </PageShell>
  );
}
