import { getSessionUser } from "@/features/auth/services/session";
import {
  resolveProductBySlug,
} from "@/features/catalog/services/product-service";
import { prisma } from "@/lib/db";
import type { Product } from "@/lib/types/product";

const productInclude = { colors: true } as const;

type DbProduct = {
  id: string;
  slug: string;
  name: string;
  categoryLabel: string;
  collection: string | null;
  description: string | null;
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  badge: Product["badge"] | null;
  sizes: string[];
  colors: { hex: string; name: string | null }[];
};

function mapDbProduct(product: DbProduct): Product {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.categoryLabel,
    collection: product.collection ?? undefined,
    description: product.description ?? undefined,
    price: product.price,
    originalPrice: product.originalPrice ?? undefined,
    discountPercent: product.discountPercent ?? undefined,
    rating: product.rating,
    reviewCount: product.reviewCount,
    image: product.imageUrl,
    badge: product.badge ?? undefined,
    sizes: product.sizes,
    colors: product.colors.map((color) => ({
      hex: color.hex,
      name: color.name ?? undefined,
    })),
  };
}

async function resolveDbProductId(slug: string): Promise<string | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });
    return product?.id ?? null;
  } catch {
    return null;
  }
}

export async function getWishlistSlugsForUser(userId: string): Promise<string[]> {
  const items = await prisma.wishlist.findMany({
    where: { userId },
    include: { product: { select: { slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return items.map((item) => item.product.slug);
}

export async function getWishlistProductsForUser(userId: string): Promise<Product[]> {
  const items = await prisma.wishlist.findMany({
    where: { userId },
    include: { product: { include: productInclude } },
    orderBy: { createdAt: "desc" },
  });

  return items.map((item) => mapDbProduct(item.product));
}

export async function toggleWishlistItemForUser(
  userId: string,
  slug: string,
  options?: { size?: string; colorHex?: string },
): Promise<{ added: boolean; slugs: string[] }> {
  const productId = await resolveDbProductId(slug);
  if (!productId) {
    throw new Error("Product not found in catalog.");
  }

  const size = options?.size ?? null;
  const colorHex = options?.colorHex ?? null;

  const existing = await prisma.wishlist.findFirst({
    where: {
      userId,
      productId,
      size,
      colorHex,
    },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    return {
      added: false,
      slugs: await getWishlistSlugsForUser(userId),
    };
  }

  await prisma.wishlist.create({
    data: {
      userId,
      productId,
      size,
      colorHex,
    },
  });

  return {
    added: true,
    slugs: await getWishlistSlugsForUser(userId),
  };
}

export async function mergeGuestWishlistSlugs(
  userId: string,
  slugs: string[],
): Promise<string[]> {
  const uniqueSlugs = [...new Set(slugs)];

  for (const slug of uniqueSlugs) {
    const productId = await resolveDbProductId(slug);
    if (!productId) continue;

    const existing = await prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
        size: null,
        colorHex: null,
      },
    });

    if (!existing) {
      await prisma.wishlist.create({
        data: {
          userId,
          productId,
          size: null,
          colorHex: null,
        },
      });
    }
  }

  return getWishlistSlugsForUser(userId);
}

export async function getWishlistStateForSession(): Promise<{
  slugs: string[];
  authenticated: boolean;
}> {
  const user = await getSessionUser();
  if (!user) {
    return { slugs: [], authenticated: false };
  }

  return {
    slugs: await getWishlistSlugsForUser(user.id),
    authenticated: true,
  };
}

export async function getWishlistProductsForSession(): Promise<Product[]> {
  const user = await getSessionUser();
  if (!user) return [];

  const dbProducts = await getWishlistProductsForUser(user.id);
  if (dbProducts.length > 0) {
    return dbProducts;
  }

  const slugs = await getWishlistSlugsForUser(user.id);
  const products = await Promise.all(slugs.map((slug) => resolveProductBySlug(slug)));
  return products.filter((product): product is Product => product !== null);
}
