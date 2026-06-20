import { KurtisPage } from "@/features/kurtis/kurtis-page";
import { parseKurtisCatalogFilters } from "@/features/kurtis/lib/kurtis-filters";

export const metadata = {
  title: "Kurtis & Sets | Silver Looms",
  description: "Browse our apparel collections. New arrivals and best sellers.",
};

interface PageProps {
  searchParams: Promise<{
    sort?: string;
    category?: string;
    size?: string;
    color?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseKurtisCatalogFilters(params);

  return <KurtisPage filters={filters} />;
}
