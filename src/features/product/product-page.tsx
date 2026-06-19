import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { resolveProductBySlug } from "@/features/catalog/services/product-service";
import { isJewelleryCategory } from "@/features/catalog/lib/category-utils";
import { ProductDetails } from "./components/product-details";
import { ProductGallery } from "./components/product-gallery";
import { RelatedProducts } from "./components/related-products";

interface ProductPageProps {
  slug: string;
}

export async function ProductPage({ slug }: ProductPageProps) {
  const product = await resolveProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isJewellery = isJewelleryCategory(product.category);

  return (
    <PageShell>
      <SiteHeader variant={isJewellery ? "jewellery" : "default"} />
      <main>
        <Container className="py-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              {
                label: isJewellery ? "Jewellery" : "Kurtis & Sets",
                href: isJewellery ? "/jewellery" : "/kurtis",
              },
              {
                label: product.category.split("·")[0]?.trim() ?? "Collection",
                href: isJewellery ? "/jewellery" : "/kurtis",
              },
              { label: product.name },
            ]}
            className="mb-8"
          />
          <div className="flex flex-col gap-12 lg:flex-row">
            <ProductGallery product={product} />
            <ProductDetails product={product} />
          </div>
          <RelatedProducts currentSlug={product.slug} />
        </Container>
      </main>
      <SiteFooter />
    </PageShell>
  );
}
