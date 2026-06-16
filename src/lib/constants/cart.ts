import { kurtisProducts, jewelleryProducts } from "./products";
import type { CartItem } from "../types/cart";

export const cartItems: CartItem[] = [
  {
    product: kurtisProducts[1],
    quantity: 1,
    size: "M",
  },
  {
    product: jewelleryProducts[0],
    quantity: 1,
  },
];

export function calculateCartSummary(items: CartItem[]) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 5000 ? 0 : 199;
  const discount = 0;
  return {
    subtotal,
    shipping,
    discount,
    total: subtotal + shipping - discount,
  };
}
