import { JewelleryPage } from "@/features/jewellery/jewellery-page";
import { parseJewelleryCatalogFilters } from "@/features/jewellery/lib/jewellery-filters";

export const metadata = {
  title: "Silver Jewellery | Silver Looms",
  description: "Handcrafted German silver and anti-tarnish jewellery from Jaipur.",
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseJewelleryCatalogFilters(params);

  return <JewelleryPage filters={filters} />;
}
