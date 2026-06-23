import { getCart } from "@/features/cart/services/cart-service";
import { CartProvider } from "@/features/cart/cart-provider";
import { getWishlistAction } from "@/features/wishlist/actions";
import { WishlistProvider } from "@/features/wishlist/wishlist-provider";
import { AuthSyncListener } from "@/features/auth/components/auth-sync-listener";
import { Toaster } from "@/components/ui/sonner";

export async function AppProviders({ children }: { children: React.ReactNode }) {
  const [initialCart, initialWishlist] = await Promise.all([
    getCart(),
    getWishlistAction(),
  ]);

  return (
    <CartProvider initialCart={initialCart}>
      <WishlistProvider
        initialSlugs={initialWishlist.slugs}
        initialAuthenticated={initialWishlist.authenticated}
      >
        <AuthSyncListener />
        {children}
        <Toaster position="top-center" richColors closeButton />
      </WishlistProvider>
    </CartProvider>
  );
}
