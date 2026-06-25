"use server";

import { saveProductImage } from "@/features/admin/services/product-image-service";

type GalleryManifestEntry =
  | { type: "url"; url: string }
  | { type: "file" };

export async function resolveProductImageUrlsFromForm(
  formData: FormData,
  slug: string,
): Promise<
  | { imageUrl: string; galleryImageUrls: string[] }
  | { error: string }
> {
  const manifestRaw = String(formData.get("galleryManifest") ?? "").trim();
  const newFiles = formData.getAll("newGalleryImages");
  let fileIndex = 0;
  const urls: string[] = [];

  if (manifestRaw) {
    try {
      const manifest = JSON.parse(manifestRaw) as GalleryManifestEntry[];
      if (!Array.isArray(manifest)) {
        return { error: "Invalid product image data." };
      }

      for (const entry of manifest) {
        if (entry.type === "url") {
          const url = entry.url.trim();
          if (url) urls.push(url);
          continue;
        }

        const file = newFiles[fileIndex];
        fileIndex += 1;
        if (!(file instanceof File) || file.size === 0) {
          return { error: "A product photo failed to upload." };
        }

        try {
          urls.push(await saveProductImage(file, `${slug}-gallery-${urls.length}`));
        } catch (uploadError) {
          const message =
            uploadError instanceof Error
              ? uploadError.message
              : "Could not upload product image.";
          return { error: message };
        }
      }
    } catch {
      return { error: "Invalid product image data." };
    }
  } else {
    const imageUrlsRaw = String(formData.get("imageUrls") ?? "[]");
    try {
      const parsed = JSON.parse(imageUrlsRaw) as unknown;
      if (Array.isArray(parsed)) {
        urls.push(...parsed.filter((value): value is string => typeof value === "string"));
      }
    } catch {
      return { error: "Invalid product image data." };
    }

    const legacyUrl = String(formData.get("imageUrl") ?? "").trim();
    if (urls.length === 0 && legacyUrl) {
      urls.push(legacyUrl);
    }

    for (let index = 0; index < newFiles.length; index += 1) {
      const file = newFiles[index];
      if (file instanceof File && file.size > 0) {
        try {
          urls.push(await saveProductImage(file, `${slug}-gallery-${urls.length}`));
        } catch (uploadError) {
          const message =
            uploadError instanceof Error
              ? uploadError.message
              : "Could not upload product image.";
          return { error: message };
        }
      }
    }
  }

  const cleaned = urls.map((url) => url.trim()).filter(Boolean);
  if (cleaned.length === 0) {
    return { error: "Add at least one product photo." };
  }

  return {
    imageUrl: cleaned[0],
    galleryImageUrls: cleaned.slice(1),
  };
}
