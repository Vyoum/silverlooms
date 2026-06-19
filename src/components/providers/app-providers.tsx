import { getCart } from "@/features/cart/services/cart-service";
import { CartProvider } from "@/features/cart/cart-provider";
import { AuthSyncListener } from "@/features/auth/components/auth-sync-listener";
import { Toaster } from "@/components/ui/sonner";

export async function AppProviders({ children }: { children: React.ReactNode }) {
  const initialCart = await getCart();

  return (
    <CartProvider initialCart={initialCart}>
      <AuthSyncListener />
      {children}
      <Toaster position="top-center" richColors closeButton />
    </CartProvider>
  );
}
