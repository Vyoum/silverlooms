import Link from "next/link";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductCard } from "@/components/shared/product-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { listBestsellerProducts } from "@/features/catalog/services/product-service";
import { CategoryHero } from "@/features/kurtis/components/category-hero";
import { JewelleryProductCard } from "@/features/jewellery/components/jewellery-product-card";
import { getApparelCatalogHeroes } from "@/lib/site-content/catalog-hero";

export async function CollectionsPage() {
  const [{ apparel, jewellery }, catalogHeroes] = await Promise.all([
    listBestsellerProducts(),
    getApparelCatalogHeroes(),
  ]);

  const hero = {
    ...catalogHeroes.bestseller,
    eyebrow: "Collections",
    subtitle: "Our most loved apparel and German silver jewellery",
  };

  return (
    <PageShell>
      <SiteHeader />
      <main>
        <CategoryHero hero={hero} />
        <div className="border-b border-border bg-cream-dark px-4 py-3 md:px-16">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Collections" },
            ]}
          />
        </div>

        <Container className="py-12 md:py-16">
          <section className="mb-16 md:mb-24">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                title="Apparel Best Sellers"
                subtitle="Kurtis, co-ord sets, and everyday ethnic wear loved by our customers."
              />
              <Link
                href="/kurtis?sort=bestseller"
                className="text-[11px] font-medium uppercase tracking-[1.1px] text-sage transition-colors hover:text-ink"
              >
                View all apparel →
              </Link>
            </div>
            {apparel.length === 0 ? (
              <p className="py-12 text-center text-sage">
                No apparel best sellers yet. Check back soon.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3">
                {apparel.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </Container>

        <section className="bg-[#1a1816] py-16 md:py-20">
          <Container>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[11px] uppercase tracking-[1.65px] text-cream-dark/70">
                  Collections
                </p>
                <h2 className="font-serif text-[32px] font-light leading-tight text-cream md:text-[42px]">
                  Jewellery Best Sellers
                </h2>
                <p className="mt-2 max-w-xl text-sm text-cream-dark/80">
                  Handcrafted German silver pieces from our Jaipur atelier.
                </p>
              </div>
              <Link
                href="/jewellery"
                className="text-[11px] font-medium uppercase tracking-[1.1px] text-cream-dark transition-colors hover:text-cream"
              >
                View all jewellery →
              </Link>
            </div>
            {jewellery.length === 0 ? (
              <p className="py-12 text-center text-cream-dark/70">
                No jewellery best sellers yet. Check back soon.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {jewellery.map((product) => (
                  <JewelleryProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </Container>
        </section>
      </main>
      <SiteFooter />
    </PageShell>
  );
}
