import { HomepageContentForm } from "@/features/admin/components/homepage-content-form";
import { getHomepageContent } from "@/lib/site-content/homepage";

export async function AdminContentPage() {
  const content = await getHomepageContent();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-medium text-admin-ink">Site Content</h1>
        <p className="mt-2 max-w-2xl text-sm text-admin-muted">
          Edit homepage sections: announcement bar, hero, editorial block, and the
          quote & portrait section with the editorial fashion image. Changes go live
          after you save.
        </p>
      </div>
      <HomepageContentForm content={content} />
    </div>
  );
}
