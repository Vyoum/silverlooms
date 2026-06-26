import { CartProvider } from "@/features/cart/cart-provider";
import { listStoreCategories } from "@/features/catalog/services/category-service";
import { StoreCategoriesProvider } from "@/features/catalog/store-categories-provider";
import { WishlistProvider } from "@/features/wishlist/wishlist-provider";
import { AuthSyncListener } from "@/features/auth/components/auth-sync-listener";
import { Toaster } from "@/components/ui/sonner";

export async function AppProviders({ children }: { children: React.ReactNode }) {
  const categories = await listStoreCategories();

  return (
    <StoreCategoriesProvider categories={categories}>
      <CartProvider>
        <WishlistProvider>
          <AuthSyncListener />
          {children}
          <Toaster position="top-center" richColors closeButton />
        </WishlistProvider>
      </CartProvider>
    </StoreCategoriesProvider>
  );
}
