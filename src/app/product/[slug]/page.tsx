import { ProductPage } from "@/features/product/product-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${title} | Silver Looms`,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <ProductPage slug={slug} />;
}
