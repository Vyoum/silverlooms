import type { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}
