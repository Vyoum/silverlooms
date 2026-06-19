import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { KurtisFooter } from "./components/kurtis-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, PageShell } from "@/components/layout/page-shell";
import { listApparelProducts } from "@/features/catalog/services/product-service";
import { ActiveFilters } from "./components/active-filters";
import { CategoryHero } from "./components/category-hero";
import { FilterSidebar } from "./components/filter-sidebar";
import { KurtisProductGrid } from "./components/product-grid";

export async function KurtisPage() {
  const products = await listApparelProducts();

  return (
    <PageShell>
      <SiteHeader />
      <main>
        <CategoryHero className="-mt-20 pt-20" />
        <ActiveFilters />
        <Container className="flex flex-col gap-8 py-12 md:flex-row">
          <FilterSidebar />
          <KurtisProductGrid products={products} />
        </Container>
      </main>
      <KurtisFooter />
    </PageShell>
  );
}
