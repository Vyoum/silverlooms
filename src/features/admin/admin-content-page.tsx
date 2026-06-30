import { HomepageContentForm } from "@/features/admin/components/homepage-content-form";
import { JewelleryHeroManager } from "@/features/admin/components/jewellery-hero-manager";
import { getHomepageContent } from "@/lib/site-content/homepage";
import { getJewelleryHeroContent } from "@/lib/site-content/jewellery-hero";

export async function AdminContentPage() {
  const [content, jewelleryHero] = await Promise.all([
    getHomepageContent(),
    getJewelleryHeroContent(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-medium text-admin-ink">Site Content</h1>
        <p className="mt-2 max-w-2xl text-sm text-admin-muted">
          Edit homepage sections, the jewellery catalog hero on /jewellery, Shop By
          Styles photos, and the quote & portrait section. Changes go live after you
          save.
        </p>
      </div>
      <HomepageContentForm content={content} />
      <JewelleryHeroManager hero={jewelleryHero} />
    </div>
  );
}
