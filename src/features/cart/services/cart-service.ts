import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import type { CartItem, CartState } from "@/lib/types/cart";
import { prisma } from "@/lib/db";
import { buildProductImages } from "@/features/catalog/lib/product-images";
import { getProductBySlug } from "@/lib/constants/products";
import {
  CART_FALLBACK_COOKIE,
  CART_SESSION_COOKIE,
} from "../lib/constants";
import { buildCartState, EMPTY_CART } from "../lib/summary";
import { resolveProductBySlug, resolveProductIdBySlug } from "@/features/catalog/services/product-service";

interface FallbackCartItem {
  slug: string;
  quantity: number;
  size?: string;
  colorHex?: string;
}

interface FallbackCartData {
  items: FallbackCartItem[];
  promoCode?: string;
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
};

async function readFallbackCart(): Promise<FallbackCartData> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_FALLBACK_COOKIE)?.value;
  if (!raw) return { items: [] };

  try {
    return JSON.parse(raw) as FallbackCartData;
  } catch {
    return { items: [] };
  }
}

async function writeFallbackCart(data: FallbackCartData): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CART_FALLBACK_COOKIE, JSON.stringify(data), COOKIE_OPTIONS);
}

async function fallbackItemsToCartItems(
  items: FallbackCartItem[],
): Promise<CartItem[]> {
  const cartItems: CartItem[] = [];

  for (const item of items) {
    const product = await resolveProductBySlug(item.slug);
    if (!product) continue;

    cartItems.push({
      id: `${item.slug}-${item.size ?? ""}-${item.colorHex ?? ""}`,
      product,
      quantity: item.quantity,
      size: item.size,
      colorHex: item.colorHex,
    });
  }

  return cartItems;
}

async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_SESSION_COOKIE)?.value;
  if (existing) return existing;

  const sessionId = randomUUID();
  cookieStore.set(CART_SESSION_COOKIE, sessionId, COOKIE_OPTIONS);
  return sessionId;
}

async function getDbCart(sessionId: string) {
  return prisma.cart.upsert({
    where: { sessionId },
    create: { sessionId },
    update: {},
    include: {
      items: {
        include: {
          product: { include: { colors: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

function mapDbCartItems(
  items: {
    id: string;
    quantity: number;
    size: string | null;
    colorHex: string | null;
    product: {
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
      badge: "NEW" | "SALE" | "BESTSELLER" | null;
      sizes: string[];
      colors: { hex: string; name: string | null }[];
    };
  }[],
): CartItem[] {
  return items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    size: item.size ?? undefined,
    colorHex: item.colorHex ?? undefined,
    product: {
      id: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      category: item.product.categoryLabel,
      collection: item.product.collection ?? undefined,
      description: item.product.description ?? undefined,
      price: item.product.price,
      originalPrice: item.product.originalPrice ?? undefined,
      discountPercent: item.product.discountPercent ?? undefined,
      rating: item.product.rating,
      reviewCount: item.product.reviewCount,
      image: item.product.imageUrl,
      images: buildProductImages(item.product.imageUrl, item.product.galleryImageUrls),
      badge: item.product.badge ?? undefined,
      sizes: item.product.sizes,
      colors: item.product.colors.map((c) => ({
        hex: c.hex,
        name: c.name ?? undefined,
      })),
    },
  }));
}

async function getCartFromDb(): Promise<CartState | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(CART_SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: { product: { include: { colors: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!cart) return buildCartState([]);

  return buildCartState(
    mapDbCartItems(cart.items),
    cart.promoCode ?? undefined,
  );
}

async function getCartFromFallback(): Promise<CartState> {
  const data = await readFallbackCart();
  const items = await fallbackItemsToCartItems(data.items);
  return buildCartState(items, data.promoCode);
}

export async function getCart(): Promise<CartState> {
  try {
    const dbCart = await getCartFromDb();
    if (dbCart !== null) return dbCart;
  } catch {
    // use fallback
  }

  return getCartFromFallback();
}

export async function addToCart(input: {
  slug: string;
  quantity?: number;
  size?: string;
  colorHex?: string;
}): Promise<CartState> {
  const quantity = input.quantity ?? 1;
  const size = input.size ?? null;
  const colorHex = input.colorHex ?? null;

  try {
    const sessionId = await getOrCreateSessionId();
    const productId = await resolveProductIdBySlug(input.slug);

    if (productId) {
      const cart = await getDbCart(sessionId);

      const existing = cart.items.find(
        (item) =>
          item.productId === productId &&
          (item.size ?? null) === size &&
          (item.colorHex ?? null) === colorHex,
      );

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
            size: size ?? undefined,
            colorHex: colorHex ?? undefined,
          },
        });
      }

      return getCart();
    }
  } catch {
    // fallback below
  }

  const product = getProductBySlug(input.slug);
  if (!product) throw new Error("Product not found");

  const data = await readFallbackCart();
  const existingIndex = data.items.findIndex(
    (item) =>
      item.slug === input.slug &&
      (item.size ?? null) === size &&
      (item.colorHex ?? null) === colorHex,
  );

  if (existingIndex >= 0) {
    data.items[existingIndex].quantity += quantity;
  } else {
    data.items.push({
      slug: input.slug,
      quantity,
      size: size ?? undefined,
      colorHex: colorHex ?? undefined,
    });
  }

  await writeFallbackCart(data);
  return getCartFromFallback();
}

export async function updateCartItemQuantity(
  itemId: string,
  quantity: number,
): Promise<CartState> {
  if (quantity < 1) {
    return removeCartItem(itemId);
  }

  try {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
    return getCart();
  } catch {
    const data = await readFallbackCart();
    const items = await fallbackItemsToCartItems(data.items);
    const target = items.find((item) => item.id === itemId);
    if (!target) return getCartFromFallback();

    const fallbackIndex = data.items.findIndex(
      (item) =>
        item.slug === target.product.slug &&
        (item.size ?? null) === (target.size ?? null) &&
        (item.colorHex ?? null) === (target.colorHex ?? null),
    );

    if (fallbackIndex >= 0) {
      data.items[fallbackIndex].quantity = quantity;
      await writeFallbackCart(data);
    }

    return getCartFromFallback();
  }
}

export async function removeCartItem(itemId: string): Promise<CartState> {
  try {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return getCart();
  } catch {
    const data = await readFallbackCart();
    const items = await fallbackItemsToCartItems(data.items);
    const target = items.find((item) => item.id === itemId);
    if (!target) return getCartFromFallback();

    data.items = data.items.filter(
      (item) =>
        !(
          item.slug === target.product.slug &&
          (item.size ?? null) === (target.size ?? null) &&
          (item.colorHex ?? null) === (target.colorHex ?? null)
        ),
    );

    await writeFallbackCart(data);
    return getCartFromFallback();
  }
}

export async function applyPromoCode(code: string): Promise<CartState> {
  const normalized = code.trim().toUpperCase();

  try {
    const sessionId = await getOrCreateSessionId();
    await prisma.cart.update({
      where: { sessionId },
      data: { promoCode: normalized },
    });
    return getCart();
  } catch {
    const data = await readFallbackCart();
    data.promoCode = normalized;
    await writeFallbackCart(data);
    return getCartFromFallback();
  }
}

export async function clearPromoCode(): Promise<CartState> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(CART_SESSION_COOKIE)?.value;
    if (sessionId) {
      await prisma.cart.update({
        where: { sessionId },
        data: { promoCode: null },
      });
    }
    return getCart();
  } catch {
    const data = await readFallbackCart();
    delete data.promoCode;
    await writeFallbackCart(data);
    return getCartFromFallback();
  }
}

export async function clearCart(): Promise<CartState> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(CART_SESSION_COOKIE)?.value;
    if (sessionId) {
      const cart = await prisma.cart.findUnique({ where: { sessionId } });
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        await prisma.cart.update({
          where: { id: cart.id },
          data: { promoCode: null },
        });
      }
    }
    return getCart();
  } catch {
    await writeFallbackCart({ items: [] });
    return EMPTY_CART;
  }
}
