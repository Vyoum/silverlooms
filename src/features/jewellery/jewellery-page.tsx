import { SiteHeader } from "@/components/layout/site-header";
import { CategoryTabs } from "./components/category-tabs";
import { JewelleryFooter } from "./components/jewellery-footer";
import { JewelleryHero } from "./components/jewellery-hero";
import { JewelleryProductGrid } from "./components/jewellery-product-grid";
import { MaterialFilterStrip } from "./components/material-filter-strip";
import { TrustSection } from "./components/trust-section";

export function JewelleryPage() {
  return (
    <div className="min-h-screen bg-ink">
      <SiteHeader variant="jewellery" />
      <main>
        <JewelleryHero />
        <CategoryTabs />
        <MaterialFilterStrip />
        <JewelleryProductGrid />
        <TrustSection />
      </main>
      <JewelleryFooter />
    </div>
  );
}
