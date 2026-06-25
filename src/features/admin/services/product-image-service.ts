import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/features/catalog/services/product-service";
import {
  ensureProductImageBucket,
  MAX_PRODUCT_IMAGE_BYTES,
  PRODUCT_IMAGE_BUCKET,
  PRODUCT_IMAGE_MIME_TYPES,
} from "@/lib/supabase/product-image-storage";

const ALLOWED_IMAGE_TYPES = new Set<string>(PRODUCT_IMAGE_MIME_TYPES);

function getFileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }

  switch (file.type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

export function validateProductImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Please upload a JPG, PNG, or WebP image.");
  }

  if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }
}

async function saveProductImageLocally(file: File, slugHint: string) {
  const { mkdir, writeFile } = await import("node:fs/promises");
  const path = await import("node:path");

  const uploadsDir = path.join(process.cwd(), "public", "images", "products");
  await mkdir(uploadsDir, { recursive: true });

  const extension = getFileExtension(file);
  const filename = `${slugify(slugHint) || "product"}-${Date.now()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(uploadsDir, filename), buffer);

  return `/images/products/${filename}`;
}

async function uploadProductImageToSupabase(file: File, slugHint: string) {
  const admin = createAdminClient();

  if (!admin) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured for image uploads.",
    );
  }

  await ensureProductImageBucket(admin);

  const extension = getFileExtension(file);
  const objectPath = `${slugify(slugHint) || "product"}-${Date.now()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await admin.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(objectPath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = admin.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}

export async function saveProductImage(file: File, slugHint: string) {
  validateProductImageFile(file);

  try {
    return await uploadProductImageToSupabase(file, slugHint);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      return saveProductImageLocally(file, slugHint);
    }

    const message =
      error instanceof Error ? error.message : "Could not upload product image.";
    throw new Error(
      `Image upload failed: ${message}. Add SUPABASE_SERVICE_ROLE_KEY on Vercel and run "npm run storage:setup", or create a public "${PRODUCT_IMAGE_BUCKET}" bucket in Supabase Storage.`,
    );
  }
}
