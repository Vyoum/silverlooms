import { KurtisPage } from "@/features/kurtis/kurtis-page";
import { parseProductSort } from "@/features/catalog/lib/product-sort";

export const metadata = {
  title: "Kurtis & Sets | Silver Looms",
  description: "Browse our apparel collections. New arrivals and best sellers.",
};

interface PageProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const sort = parseProductSort(params.sort);

  return <KurtisPage sort={sort} />;
}
