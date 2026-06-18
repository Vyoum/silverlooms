import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageShell } from "@/components/layout/page-shell";
import { JewelleryHero } from "./components/jewellery-hero";
import { JewelleryProductGrid } from "./components/jewellery-product-grid";
import { SubcategoryStrip } from "./components/subcategory-strip";
import { TrustSection } from "./components/trust-section";

export function JewelleryPage() {
  return (
    <PageShell>
      <SiteHeader />
      <main>
        <JewelleryHero />
        <SubcategoryStrip />
        <JewelleryProductGrid />
        <TrustSection />
      </main>
      <SiteFooter />
    </PageShell>
  );
}
