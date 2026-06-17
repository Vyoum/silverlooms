import type { Product } from "./product";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  colorHex?: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface CartState {
  items: CartItem[];
  summary: CartSummary;
  itemCount: number;
  promoCode?: string;
}

export interface AddToCartInput {
  slug: string;
  quantity?: number;
  size?: string;
  colorHex?: string;
}
