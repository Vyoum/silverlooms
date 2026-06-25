export const CART_SESSION_COOKIE = "silverlooms_cart_session";
export const CART_FALLBACK_COOKIE = "silverlooms_cart_data";

export const PROMO_CODES = {
  SILVER10: { type: "percent" as const, value: 10, label: "10% off" },
  WELCOME500: { type: "flat" as const, value: 500, label: "₹500 off" },
} as const;

export type PromoCode = keyof typeof PROMO_CODES;
