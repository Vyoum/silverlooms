import type { Metadata } from "next";
import { JewelleryPage } from "@/features/jewellery/jewellery-page";
import {
  getJewelleryCategoryLabel,
  getJewelleryMaterialLabel,
  parseJewelleryCatalogFilters,
} from "@/features/jewellery/lib/jewellery-filters";
import { pageMetadata } from "@/lib/seo/metadata";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    material?: string;
    price?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const filters = parseJewelleryCatalogFilters(params);
  const categoryLabel = getJewelleryCategoryLabel(filters.category);
  const materialLabel = getJewelleryMaterialLabel(filters.material);

  const titleParts = ["German Silver"];
  if (categoryLabel) titleParts.unshift(categoryLabel);
  if (materialLabel) titleParts.push(materialLabel);

  const title = titleParts.join(" — ");
  const description = categoryLabel
    ? `Shop ${categoryLabel.toLowerCase()}${materialLabel ? ` in ${materialLabel.toLowerCase()}` : ""} — handcrafted German silver and anti-tarnish jewellery from Jaipur.`
    : "Handcrafted German silver, anti-tarnish, and temple jewellery from Jaipur. Earrings, necklaces, bangles, rings, and more.";

  const query = new URLSearchParams();
  if (filters.category) query.set("category", filters.category);
  if (filters.material) query.set("material", filters.material);
  if (filters.price) query.set("price", filters.price);
  const path = query.toString() ? `/jewellery?${query}` : "/jewellery";

  return pageMetadata({
    title,
    description,
    path,
    image: "/images/kurtis-hero.jpg",
  });
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseJewelleryCatalogFilters(params);

  return <JewelleryPage filters={filters} />;
}
