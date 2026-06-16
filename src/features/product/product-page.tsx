import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getProductBySlug } from "@/lib/constants/products";
import { ProductDetails } from "./components/product-details";
import { ProductGallery } from "./components/product-gallery";
import { RelatedProducts } from "./components/related-products";

interface ProductPageProps {
  slug: string;
}

export function ProductPage({ slug }: ProductPageProps) {
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <PageShell>
      <SiteHeader />
      <main className="pt-20">
        <Container className="py-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Kurtis & Sets", href: "/kurtis" },
              { label: product.category.split("·")[0]?.trim() ?? "Collection", href: "/kurtis" },
              { label: product.name },
            ]}
            className="mb-8"
          />
          <div className="flex flex-col gap-12 lg:flex-row">
            <ProductGallery product={product} />
            <ProductDetails product={product} />
          </div>
          <RelatedProducts currentProduct={product} />
        </Container>
      </main>
      <SiteFooter />
    </PageShell>
  );
}
