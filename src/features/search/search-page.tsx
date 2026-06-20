import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, PageShell } from "@/components/layout/page-shell";
import { ProductCard } from "@/components/shared/product-card";
import { searchProducts } from "@/features/catalog/services/product-service";

interface SearchPageProps {
  query: string;
}

export async function SearchPage({ query }: SearchPageProps) {
  const trimmed = query.trim();
  const products = trimmed.length >= 2 ? await searchProducts(trimmed) : [];

  return (
    <PageShell>
      <SiteHeader />
      <main>
        <Container className="py-12">
          <div className="mb-10">
            <p className="text-[11px] uppercase tracking-[1.65px] text-sage">
              Search
            </p>
            <h1 className="mt-2 font-serif text-[42px] font-light text-ink">
              {trimmed.length >= 2 ? (
                <>
                  Results for &ldquo;{trimmed}&rdquo;
                </>
              ) : (
                "Search our store"
              )}
            </h1>
            {trimmed.length >= 2 && (
              <p className="mt-2 text-sm text-sage">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"} found
              </p>
            )}
          </div>

          {trimmed.length < 2 ? (
            <p className="py-16 text-center text-sage">
              Enter at least 2 characters to search.
            </p>
          ) : products.length === 0 ? (
            <p className="py-16 text-center text-sage">
              No products matched your search. Try a different keyword.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
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
