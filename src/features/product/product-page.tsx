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
import { breadcrumbJsonLd, JsonLd, productJsonLd } from "@/lib/seo/json-ld";

interface ProductPageProps {
  slug: string;
}

export async function ProductPage({ slug }: ProductPageProps) {
  const product = await resolveProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isJewellery = isJewelleryCategory(product.category);
  const collectionLabel =
    product.category.split("·")[0]?.trim() ?? "Collection";

  return (
    <PageShell>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          {
            name: isJewellery ? "Jewellery" : "Kurtis & Sets",
            href: isJewellery ? "/jewellery" : "/kurtis",
          },
          {
            name: collectionLabel,
            href: isJewellery ? "/jewellery" : "/kurtis",
          },
          { name: product.name },
        ])}
      />
      <SiteHeader variant={isJewellery ? "jewellery" : "default"} />
      <main>
        <Container className="py-4 md:py-8">
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
            className="mb-4 text-xs md:mb-8 md:text-sm"
          />
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
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
