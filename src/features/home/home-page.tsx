import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageShell } from "@/components/layout/page-shell";
import { BrandStorySection } from "./components/brand-story-section";
import { EditorialSection } from "./components/editorial-section";
import { FabricSection } from "./components/fabric-section";
import { GoodReadsSection } from "./components/good-reads-section";
import { HeroSection } from "./components/hero-section";
import { MarqueeSection } from "./components/marquee-section";
import { NewArrivalsSection } from "./components/new-arrivals-section";
import { NewsletterSection } from "./components/newsletter-section";
import { StyleSection } from "./components/style-section";
import { getHomepageContent } from "@/lib/site-content/homepage";
import { listMarqueeCategories } from "@/features/catalog/services/category-service";

export async function HomePage() {
  const [content, marqueeItems] = await Promise.all([
    getHomepageContent(),
    listMarqueeCategories(),
  ]);

  return (
    <PageShell>
      <AnnouncementBar content={content.announcement} />
      <SiteHeader variant="home" />
      <main>
        <HeroSection content={content.hero} />
        <MarqueeSection items={marqueeItems} />
        <FabricSection content={content.shopByFabric} />
        <StyleSection styles={content.shopByStyles} />
        <NewArrivalsSection />
        <GoodReadsSection />
        <EditorialSection content={content.editorial} />
        <BrandStorySection content={content.brandStory} />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </PageShell>
  );
}
