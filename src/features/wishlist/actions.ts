"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/features/auth/services/session";
import { resolveProductBySlug } from "@/features/catalog/services/product-service";
import type { Product } from "@/lib/types/product";
import {
  getWishlistProductsForSession,
  getWishlistStateForSession,
  mergeGuestWishlistSlugs,
  toggleWishlistItemForUser,
} from "./services/wishlist-service";

function revalidateWishlistPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/wishlist");
}

export async function getWishlistAction() {
  return getWishlistStateForSession();
}

export async function getWishlistProductsAction(
  guestSlugs: string[] = [],
): Promise<Product[]> {
  const user = await getSessionUser();
  if (user) {
    return getWishlistProductsForSession();
  }

  const products = await Promise.all(
    guestSlugs.map((slug) => resolveProductBySlug(slug)),
  );
  return products.filter((product): product is Product => product !== null);
}

export async function toggleWishlistAction(
  slug: string,
  options?: { size?: string; colorHex?: string },
): Promise<
  | { ok: true; added: boolean; slugs: string[]; authenticated: true }
  | { ok: false; requiresAuth: true }
  | { ok: false; error: string }
> {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, requiresAuth: true };
  }

  try {
    const result = await toggleWishlistItemForUser(user.id, slug, options);
    revalidateWishlistPaths();
    return {
      ok: true,
      added: result.added,
      slugs: result.slugs,
      authenticated: true,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Could not update wishlist. Please try again.",
    };
  }
}

export async function syncGuestWishlistAction(guestSlugs: string[]) {
  const user = await getSessionUser();
  if (!user || guestSlugs.length === 0) {
    return getWishlistStateForSession();
  }

  const slugs = await mergeGuestWishlistSlugs(user.id, guestSlugs);
  revalidateWishlistPaths();

  return {
    slugs,
    authenticated: true as const,
  };
}
