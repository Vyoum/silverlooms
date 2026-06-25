"use server";

import { revalidatePath } from "next/cache";
import { saveProductImage } from "@/features/admin/services/product-image-service";
import { requireAdminUser } from "@/features/auth/services/session";
import {
  getHomepageContent,
  saveHomepageContent,
} from "@/lib/site-content/homepage";
import type { HomepageContent } from "@/lib/site-content/types";

export type ContentActionResult = { success: boolean; error?: string };

async function parseHomepageForm(formData: FormData): Promise<HomepageContent> {
  const current = await getHomepageContent();

  const read = (key: string) => String(formData.get(key) ?? "").trim();

  return {
    announcement: {
      text: read("announcementText") || current.announcement.text,
      linkText: read("announcementLinkText") || current.announcement.linkText,
      linkHref: read("announcementLinkHref") || current.announcement.linkHref,
    },
    hero: {
      eyebrow: read("heroEyebrow") || current.hero.eyebrow,
      titleLine1: read("heroTitleLine1") || current.hero.titleLine1,
      titleAccent: read("heroTitleAccent") || current.hero.titleAccent,
      titleLine2: read("heroTitleLine2") || current.hero.titleLine2,
      subtitle: read("heroSubtitle") || current.hero.subtitle,
      primaryCtaLabel: read("heroPrimaryCtaLabel") || current.hero.primaryCtaLabel,
      primaryCtaHref: read("heroPrimaryCtaHref") || current.hero.primaryCtaHref,
      secondaryCtaLabel:
        read("heroSecondaryCtaLabel") || current.hero.secondaryCtaLabel,
      secondaryCtaHref:
        read("heroSecondaryCtaHref") || current.hero.secondaryCtaHref,
      imageUrl: read("heroImageUrl") || current.hero.imageUrl,
      imageAlt: read("heroImageAlt") || current.hero.imageAlt,
    },
    editorial: {
      eyebrow: read("editorialEyebrow") || current.editorial.eyebrow,
      title: read("editorialTitle") || current.editorial.title,
      body: read("editorialBody") || current.editorial.body,
      linkText: read("editorialLinkText") || current.editorial.linkText,
      linkHref: read("editorialLinkHref") || current.editorial.linkHref,
      imageUrl: read("editorialImageUrl") || current.editorial.imageUrl,
      imageAlt: read("editorialImageAlt") || current.editorial.imageAlt,
    },
    brandStory: {
      quote: read("brandStoryQuote") || current.brandStory.quote,
      captionEyebrow:
        read("brandStoryCaptionEyebrow") || current.brandStory.captionEyebrow,
      captionTitle:
        read("brandStoryCaptionTitle") || current.brandStory.captionTitle,
      imageUrl: read("brandStoryImageUrl") || current.brandStory.imageUrl,
      imageAlt: read("brandStoryImageAlt") || current.brandStory.imageAlt,
    },
    shopByStyles: current.shopByStyles.map((style, index) => ({
      name: read(`style${index}Name`) || style.name,
      imageUrl: read(`style${index}ImageUrl`) || style.imageUrl,
      imageAlt: read(`style${index}ImageAlt`) || style.imageAlt,
      href: read(`style${index}Href`) || style.href,
    })),
  };
}

async function applyImageUploads(
  content: HomepageContent,
  formData: FormData,
): Promise<HomepageContent> {
  const uploads: {
    field: keyof Pick<HomepageContent, "hero" | "editorial" | "brandStory">;
    file: FormDataEntryValue | null;
    slug: string;
  }[] = [
    { field: "hero", file: formData.get("heroImage"), slug: "homepage-hero" },
    {
      field: "editorial",
      file: formData.get("editorialImage"),
      slug: "homepage-editorial",
    },
    {
      field: "brandStory",
      file: formData.get("brandStoryImage"),
      slug: "homepage-brand-story",
    },
  ];

  const next = { ...content };

  for (const upload of uploads) {
    if (!(upload.file instanceof File) || upload.file.size === 0) continue;

    const imageUrl = await saveProductImage(upload.file, upload.slug);
    if (upload.field === "hero") {
      next.hero = { ...next.hero, imageUrl };
    } else if (upload.field === "editorial") {
      next.editorial = { ...next.editorial, imageUrl };
    } else {
      next.brandStory = { ...next.brandStory, imageUrl };
    }
  }

  const styleCount = next.shopByStyles.length;
  for (let index = 0; index < styleCount; index += 1) {
    const file = formData.get(`style${index}Image`);
    if (!(file instanceof File) || file.size === 0) continue;

    const imageUrl = await saveProductImage(file, `homepage-style-${index}`);
    next.shopByStyles = next.shopByStyles.map((style, styleIndex) =>
      styleIndex === index ? { ...style, imageUrl } : style,
    );
  }

  return next;
}

export async function getHomepageContentAction() {
  try {
    await requireAdminUser();
    const content = await getHomepageContent();
    return { success: true as const, content };
  } catch {
    return { success: false as const, error: "Could not load homepage content." };
  }
}

export async function updateHomepageContentAction(
  formData: FormData,
): Promise<ContentActionResult> {
  try {
    await requireAdminUser();

    let content = await parseHomepageForm(formData);

    try {
      content = await applyImageUploads(content, formData);
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Could not upload image.";
      return { success: false, error: message };
    }

    await saveHomepageContent(content);

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/content");

    return { success: true };
  } catch (error) {
    console.error("[admin] updateHomepageContentAction failed:", error);
    return { success: false, error: "Failed to save homepage content." };
  }
}
