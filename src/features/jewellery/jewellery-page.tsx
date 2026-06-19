import { SiteHeader } from "@/components/layout/site-header";
import { listJewelleryProducts } from "@/features/catalog/services/product-service";
import { CategoryTabs } from "./components/category-tabs";
import { JewelleryFooter } from "./components/jewellery-footer";
import { JewelleryHero } from "./components/jewellery-hero";
import { JewelleryProductGrid } from "./components/jewellery-product-grid";
import { MaterialFilterStrip } from "./components/material-filter-strip";
import { TrustSection } from "./components/trust-section";

export async function JewelleryPage() {
  const products = await listJewelleryProducts();

  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteHeader variant="jewellery" />
      <main>
        <JewelleryHero />
        <MaterialFilterStrip />
        <JewelleryProductGrid products={products} />
        <TrustSection />
      </main>
      <JewelleryFooter />
    </div>
  );
}
