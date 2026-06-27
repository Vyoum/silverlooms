import type { Metadata } from "next";
import { KurtisPage } from "@/features/kurtis/kurtis-page";
import { FALLBACK_CATALOG_CATEGORY_OPTIONS } from "@/features/kurtis/lib/kurtis-filters";
import { pageMetadata } from "@/lib/seo/metadata";

interface PageProps {
  searchParams: Promise<{
    sort?: string;
    category?: string;
    size?: string;
    color?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = FALLBACK_CATALOG_CATEGORY_OPTIONS.find(
    (option) => option.slug === params.category,
  );

  const title = category
    ? `${category.label} Kurtis & Sets`
    : "Kurtis & Co-ord Sets";
  const description = category
    ? `Browse ${category.label.toLowerCase()} kurtis, co-ord sets, and ethnic wear at Silver Looms. Artisanal fabrics and contemporary Indian silhouettes.`
    : "Browse artisanal kurtis, co-ord sets, leheriya, bandhej, and everyday ethnic wear. New arrivals and bestsellers at Silver Looms.";

  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  const path = query.toString() ? `/kurtis?${query}` : "/kurtis";

  return pageMetadata({
    title,
    description,
    path,
    image: "/images/kurtis-hero.jpg",
  });
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  return <KurtisPage searchParams={params} />;
}
