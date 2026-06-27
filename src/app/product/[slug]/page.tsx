import type { Metadata } from "next";
import { ProductPage } from "@/features/product/product-page";
import { resolveProductBySlug } from "@/features/catalog/services/product-service";
import { pageMetadata } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolveProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const description =
    product.description?.slice(0, 160) ??
    `Shop ${product.name} — ${product.category} at Silver Looms. Handcrafted quality with free shipping across India.`;

  return pageMetadata({
    title: product.name,
    description,
    path: `/product/${product.slug}`,
    image: product.image,
    imageAlt: product.name,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <ProductPage slug={slug} />;
}
