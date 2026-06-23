"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, PageShell } from "@/components/layout/page-shell";
import { ProductCard } from "@/components/shared/product-card";
import { getWishlistProductsAction } from "@/features/wishlist/actions";
import { useWishlist } from "@/features/wishlist/wishlist-provider";
import type { Product } from "@/lib/types/product";

export function WishlistPage() {
  const { slugs, itemCount, authenticated } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      const nextProducts = await getWishlistProductsAction(
        authenticated ? [] : slugs,
      );

      if (!cancelled) {
        setProducts(nextProducts);
        setLoading(false);
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [slugs, authenticated]);

  return (
    <PageShell>
      <SiteHeader />
      <main>
        <Container className="py-12">
          <div className="mb-10">
            <h1 className="font-serif text-[42px] font-light text-ink">
              Wishlist
            </h1>
            <p className="mt-1 text-sm text-sage">
              {itemCount} {itemCount === 1 ? "item" : "items"} saved
              {!authenticated && itemCount > 0
                ? " locally — sign in to save to your account"
                : ""}
            </p>
          </div>

          {loading ? (
            <p className="py-16 text-center text-sage">Loading wishlist...</p>
          ) : products.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sage">Your wishlist is empty.</p>
              <Link
                href="/kurtis"
                className="mt-4 inline-block text-sm uppercase tracking-wider text-ink underline"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Container>
      </main>
      <SiteFooter />
    </PageShell>
  );
}
