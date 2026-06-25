import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export const PRODUCT_IMAGE_BUCKET = "product-images";
export const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024;
export const PRODUCT_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export async function ensureProductImageBucket(
  supabase: SupabaseClient,
) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(listError.message);
  }

  if (buckets?.some((bucket) => bucket.name === PRODUCT_IMAGE_BUCKET)) {
    return;
  }

  const { error } = await supabase.storage.createBucket(PRODUCT_IMAGE_BUCKET, {
    public: true,
    fileSizeLimit: MAX_PRODUCT_IMAGE_BYTES,
    allowedMimeTypes: [...PRODUCT_IMAGE_MIME_TYPES],
  });

  if (error && !error.message.toLowerCase().includes("already exists")) {
    throw new Error(error.message);
  }
}

export async function setupProductImageStorage() {
  const admin = createAdminClient();

  if (!admin) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required to create the product-images bucket.",
    );
  }

  await ensureProductImageBucket(admin);
  return PRODUCT_IMAGE_BUCKET;
}
