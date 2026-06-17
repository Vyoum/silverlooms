import type { CartItem, CartState, CartSummary } from "@/lib/types/cart";
import {
  FREE_SHIPPING_THRESHOLD,
  PROMO_CODES,
  STANDARD_SHIPPING_FEE,
  type PromoCode,
} from "./constants";

export function calculateCartSummary(
  items: CartItem[],
  promoCode?: string,
): CartSummary {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  let discount = 0;
  if (promoCode && promoCode in PROMO_CODES) {
    const promo = PROMO_CODES[promoCode as PromoCode];
    discount =
      promo.type === "percent"
        ? Math.round((subtotal * promo.value) / 100)
        : Math.min(promo.value, subtotal);
  }

  const discountedSubtotal = Math.max(subtotal - discount, 0);
  const shipping =
    discountedSubtotal >= FREE_SHIPPING_THRESHOLD || discountedSubtotal === 0
      ? 0
      : STANDARD_SHIPPING_FEE;

  return {
    subtotal,
    shipping,
    discount,
    total: discountedSubtotal + shipping,
  };
}

export function buildCartState(
  items: CartItem[],
  promoCode?: string,
): CartState {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return {
    items,
    itemCount,
    promoCode,
    summary: calculateCartSummary(items, promoCode),
  };
}

export const EMPTY_CART: CartState = buildCartState([]);
