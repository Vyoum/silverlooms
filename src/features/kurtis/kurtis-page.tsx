import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { KurtisFooter } from "./components/kurtis-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, PageShell } from "@/components/layout/page-shell";
import { listCatalogProducts } from "@/features/catalog/services/product-service";
import type { ProductSort } from "@/features/catalog/lib/product-sort";
import { ActiveFilters } from "./components/active-filters";
import { CategoryHero } from "./components/category-hero";
import { FilterSidebar } from "./components/filter-sidebar";
import { KurtisProductGrid } from "./components/product-grid";

interface KurtisPageProps {
  sort: ProductSort;
}

export async function KurtisPage({ sort }: KurtisPageProps) {
  const products = await listCatalogProducts(sort);

  return (
    <PageShell>
      <SiteHeader />
      <main>
        <CategoryHero sort={sort} className="-mt-20 pt-20" />
        <ActiveFilters sort={sort} productCount={products.length} />
        <Container className="flex flex-col gap-8 py-12 md:flex-row">
          <FilterSidebar sort={sort} />
          <KurtisProductGrid products={products} sort={sort} />
        </Container>
      </main>
      <KurtisFooter />
    </PageShell>
  );
}
