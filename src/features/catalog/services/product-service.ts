import type { ProductBadge } from "@/lib/types/product";
import type { Product } from "@/lib/types/product";
import {
  filterProductsBySort,
  type ProductSort,
} from "@/features/catalog/lib/product-sort";
import { getProductBySlug, jewelleryProducts, kurtisProducts } from "@/lib/constants/products";
import { prisma } from "@/lib/db";
import { buildProductImages } from "@/features/catalog/lib/product-images";
import { isJewelleryCategory, slugify } from "../lib/category-utils";

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
  galleryImageUrls: string[];
  badge: ProductBadge | null;
  sizes: string[];
  colors: { hex: string; name: string | null }[];
};

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    images: product.images?.length ? product.images : [product.image],
  };
}

function mapDbProduct(product: DbProduct): Product {
  const images = buildProductImages(product.imageUrl, product.galleryImageUrls);

  return normalizeProduct({
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
    image: images[0] ?? product.imageUrl,
    images,
    badge: product.badge ?? undefined,
    sizes: product.sizes,
    colors: product.colors.map((c) => ({
      hex: c.hex,
      name: c.name ?? undefined,
    })),
  });
}

const productInclude = { colors: true } as const;

async function fetchAllProducts(): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      include: productInclude,
      orderBy: { createdAt: "desc" },
    });
    if (dbProducts.length > 0) {
      return dbProducts.map(mapDbProduct);
    }
  } catch {
    // fall through to static catalog
  }
  return [...kurtisProducts, ...jewelleryProducts].map(normalizeProduct);
}

export async function listProducts(): Promise<Product[]> {
  return fetchAllProducts();
}

export async function listApparelProducts(): Promise<Product[]> {
  const products = await fetchAllProducts();
  return products.filter((p) => !isJewelleryCategory(p.category));
}

export async function listCatalogProducts(sort: ProductSort): Promise<Product[]> {
  const products = await fetchAllProducts();

  if (sort === "bestseller" || sort === "new") {
    return filterProductsBySort(products, sort);
  }

  return products.filter((p) => !isJewelleryCategory(p.category));
}

export async function listJewelleryProducts(): Promise<Product[]> {
  const products = await fetchAllProducts();
  return products.filter((p) => isJewelleryCategory(p.category));
}

export async function listNewArrivals(limit = 4): Promise<Product[]> {
  const products = await fetchAllProducts();
  return filterProductsBySort(products, "new").slice(0, limit);
}

export async function resolveProductBySlug(slug: string): Promise<Product | null> {
  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug },
      include: productInclude,
    });

    if (dbProduct) {
      return mapDbProduct(dbProduct);
    }
  } catch {
    // Database unavailable — fall back to static catalog
  }

  return getProductBySlug(slug) ? normalizeProduct(getProductBySlug(slug)!) : null;
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

export async function listRelatedProducts(
  currentSlug: string,
  limit = 4,
): Promise<Product[]> {
  const products = await fetchAllProducts();
  return products.filter((p) => p.slug !== currentSlug).slice(0, limit);
}

export async function searchProducts(
  query: string,
  limit = 48,
): Promise<Product[]> {
  const term = query.trim();
  if (term.length < 2) return [];

  const normalized = term.toLowerCase();

  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { categoryLabel: { contains: term, mode: "insensitive" } },
          { collection: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
          { slug: { contains: normalized, mode: "insensitive" } },
        ],
      },
      include: productInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    if (dbProducts.length > 0) {
      return dbProducts.map(mapDbProduct);
    }
  } catch {
    // fall through to static catalog
  }

  const products = await fetchAllProducts();
  return products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized) ||
        product.collection?.toLowerCase().includes(normalized) ||
        product.description?.toLowerCase().includes(normalized) ||
        product.slug.toLowerCase().includes(normalized),
    )
    .slice(0, limit);
}

export interface CreateProductData {
  name: string;
  slug: string;
  categoryLabel: string;
  collection?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
  imageUrl: string;
  galleryImageUrls?: string[];
  badge?: ProductBadge;
  sizes: string[];
  colors: { hex: string; name?: string }[];
  stockQuantity: number;
}

export async function createProduct(data: CreateProductData) {
  const inventorySizes = data.sizes.length > 0 ? data.sizes : ["ONE_SIZE"];

  const product = await prisma.product.create({
    data: {
      slug: data.slug,
      name: data.name,
      categoryLabel: data.categoryLabel,
      collection: data.collection,
      description: data.description,
      price: data.price,
      originalPrice: data.originalPrice,
      discountPercent: data.discountPercent,
      rating: data.rating ?? 4.5,
      reviewCount: data.reviewCount ?? 0,
      imageUrl: data.imageUrl,
      galleryImageUrls: data.galleryImageUrls ?? [],
      badge: data.badge,
      sizes: data.sizes,
      colors: {
        create: data.colors.map((c) => ({ hex: c.hex, name: c.name })),
      },
    },
    include: productInclude,
  });

  for (const size of inventorySizes) {
    await prisma.inventory.create({
      data: {
        productId: product.id,
        size,
        sku: size === "ONE_SIZE" ? data.slug : `${data.slug}-${size.toLowerCase()}`,
        quantity: data.stockQuantity,
        lowStockThreshold: 5,
      },
    });
  }

  return mapDbProduct(product);
}

export interface UpdateProductData {
  name: string;
  slug: string;
  categoryLabel: string;
  collection?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
  imageUrl: string;
  galleryImageUrls?: string[];
  badge?: ProductBadge;
  sizes: string[];
  colors: { hex: string; name?: string }[];
}

export async function updateProduct(productId: string, data: UpdateProductData) {
  await prisma.productColor.deleteMany({ where: { productId } });

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      slug: data.slug,
      name: data.name,
      categoryLabel: data.categoryLabel,
      collection: data.collection,
      description: data.description,
      price: data.price,
      originalPrice: data.originalPrice,
      discountPercent: data.discountPercent,
      rating: data.rating ?? 4.5,
      reviewCount: data.reviewCount ?? 0,
      imageUrl: data.imageUrl,
      galleryImageUrls: data.galleryImageUrls ?? [],
      badge: data.badge,
      sizes: data.sizes,
      colors: {
        create: data.colors.map((c) => ({ hex: c.hex, name: c.name })),
      },
    },
    include: productInclude,
  });

  return mapDbProduct(product);
}

export { slugify };
