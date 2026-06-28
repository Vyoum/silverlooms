"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import type { CartState } from "@/lib/types/cart";
import { EMPTY_CART } from "./lib/summary";
import {
  addToCartAction,
  applyPromoCodeAction,
  clearPromoCodeAction,
  getCartAction,
  removeCartItemAction,
  updateCartItemQuantityAction,
} from "./actions";

interface CartContextValue {
  cart: CartState;
  itemCount: number;
  isPending: boolean;
  addToCart: (input: {
    slug: string;
    quantity?: number;
    size?: string;
    colorHex?: string;
  }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyPromo: (code: string) => Promise<boolean>;
  clearPromo: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: React.ReactNode;
  initialCart?: CartState;
}

export function CartProvider({
  children,
  initialCart = EMPTY_CART,
}: CartProviderProps) {
  const [cart, setCart] = useState<CartState>(initialCart);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    void getCartAction()
      .then(setCart)
      .catch(() => {
        // Cart loads from cookies on the client after hydration.
      });
  }, []);

  const addToCart = useCallback(
    async (input: {
      slug: string;
      quantity?: number;
      size?: string;
      colorHex?: string;
    }) => {
      try {
        const result = await addToCartAction(input);
        setCart(result.cart);
        toast.success(result.message);
      } catch {
        toast.error("Could not add item to bag. Please try again.");
        throw new Error("add-to-cart-failed");
      }
    },
    [],
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      startTransition(async () => {
        try {
          const nextCart = await updateCartItemQuantityAction(itemId, quantity);
          setCart(nextCart);
        } catch {
          toast.error("Could not update quantity.");
        }
      });
    },
    [],
  );

  const removeItem = useCallback(async (itemId: string) => {
    startTransition(async () => {
      try {
        const nextCart = await removeCartItemAction(itemId);
        setCart(nextCart);
        toast.success("Item removed from bag");
      } catch {
        toast.error("Could not remove item.");
      }
    });
  }, []);

  const applyPromo = useCallback(async (code: string) => {
    return new Promise<boolean>((resolve) => {
      startTransition(async () => {
        const result = await applyPromoCodeAction(code);
        setCart(result.cart);
        if (result.success) {
          toast.success(result.message);
          resolve(true);
        } else {
          toast.error(result.message);
          resolve(false);
        }
      });
    });
  }, []);

  const clearPromo = useCallback(async () => {
    startTransition(async () => {
      const nextCart = await clearPromoCodeAction();
      setCart(nextCart);
    });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      itemCount: cart.itemCount,
      isPending,
      addToCart,
      updateQuantity,
      removeItem,
      applyPromo,
      clearPromo,
    }),
    [cart, isPending, addToCart, updateQuantity, removeItem, applyPromo, clearPromo],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
