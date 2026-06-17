"use server";

import { revalidatePath } from "next/cache";
import type { CartState } from "@/lib/types/cart";
import { PROMO_CODES } from "./lib/constants";
import {
  addToCart,
  applyPromoCode,
  clearPromoCode,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
} from "./services/cart-service";

function revalidateCartPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/cart");
}

export async function getCartAction(): Promise<CartState> {
  return getCart();
}

export async function addToCartAction(input: {
  slug: string;
  quantity?: number;
  size?: string;
  colorHex?: string;
}): Promise<{ cart: CartState; message: string }> {
  const cart = await addToCart(input);
  revalidateCartPaths();

  const product = cart.items.find((item) => item.product.slug === input.slug);
  const name = product?.product.name ?? "Item";

  return {
    cart,
    message: `${name} added to your bag`,
  };
}

export async function updateCartItemQuantityAction(
  itemId: string,
  quantity: number,
): Promise<CartState> {
  const cart = await updateCartItemQuantity(itemId, quantity);
  revalidateCartPaths();
  return cart;
}

export async function removeCartItemAction(itemId: string): Promise<CartState> {
  const cart = await removeCartItem(itemId);
  revalidateCartPaths();
  return cart;
}

export async function applyPromoCodeAction(
  code: string,
): Promise<{ cart: CartState; success: boolean; message: string }> {
  const normalized = code.trim().toUpperCase();

  if (!(normalized in PROMO_CODES)) {
    return {
      cart: await getCart(),
      success: false,
      message: "Invalid promo code",
    };
  }

  const cart = await applyPromoCode(normalized);
  revalidateCartPaths();

  const promo = PROMO_CODES[normalized as keyof typeof PROMO_CODES];
  return {
    cart,
    success: true,
    message: `Promo applied: ${promo.label}`,
  };
}

export async function clearPromoCodeAction(): Promise<CartState> {
  const cart = await clearPromoCode();
  revalidateCartPaths();
  return cart;
}
