import { config } from "dotenv";
import {
  PRODUCT_IMAGE_BUCKET,
  setupProductImageStorage,
} from "../src/lib/supabase/product-image-storage";

config({ path: ".env.local" });

async function main() {
  try {
    await setupProductImageStorage();
    console.log(`Storage OK — public bucket "${PRODUCT_IMAGE_BUCKET}" is ready.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Storage setup failed: ${message}`);
    process.exit(1);
  }
}

void main();
