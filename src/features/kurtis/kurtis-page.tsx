import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { KurtisFooter } from "./components/kurtis-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, PageShell } from "@/components/layout/page-shell";
import { ActiveFilters } from "./components/active-filters";
import { CategoryHero } from "./components/category-hero";
import { FilterSidebar } from "./components/filter-sidebar";
import { KurtisProductGrid } from "./components/product-grid";

export function KurtisPage() {
  return (
    <PageShell>
      <SiteHeader />
      <main className="pt-20">
        <CategoryHero />
        <ActiveFilters />
        <Container className="flex flex-col gap-8 py-12 md:flex-row">
          <FilterSidebar />
          <KurtisProductGrid />
        </Container>
      </main>
      <KurtisFooter />
    </PageShell>
  );
}
