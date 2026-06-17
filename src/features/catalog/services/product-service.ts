import type { ProductBadge } from "@/lib/types/product";
import type { Product } from "@/lib/types/product";
import { getProductBySlug } from "@/lib/constants/products";
import { prisma } from "@/lib/db";

function mapDbProduct(product: {
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
  badge: ProductBadge | null;
  sizes: string[];
  colors: { hex: string; name: string | null }[];
}): Product {
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
    colors: product.colors.map((c) => ({
      hex: c.hex,
      name: c.name ?? undefined,
    })),
  };
}

export async function resolveProductBySlug(slug: string): Promise<Product | null> {
  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug },
      include: { colors: true },
    });

    if (dbProduct) {
      return mapDbProduct(dbProduct);
    }
  } catch {
    // Database unavailable — fall back to static catalog
  }

  return getProductBySlug(slug) ?? null;
}

export async function resolveProductIdBySlug(slug: string): Promise<string | null> {
  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (dbProduct) return dbProduct.id;
  } catch {
    // fall through
  }

  return getProductBySlug(slug)?.id ?? null;
}
