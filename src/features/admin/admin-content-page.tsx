import { HomepageContentForm } from "@/features/admin/components/homepage-content-form";
import { getHomepageContent } from "@/lib/site-content/homepage";

export async function AdminContentPage() {
  const content = await getHomepageContent();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-medium text-admin-ink">Site Content</h1>
        <p className="mt-2 max-w-2xl text-sm text-admin-muted">
          Edit homepage banners, copy, and images. Changes appear on the live storefront
          after you save.
        </p>
      </div>
      <HomepageContentForm content={content} />
    </div>
  );
}
