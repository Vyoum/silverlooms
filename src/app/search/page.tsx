import type { Metadata } from "next";
import { SearchPage } from "@/features/search/search-page";
import { noIndexMetadata } from "@/lib/seo/metadata";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q?.trim();

  return {
    title: query ? `Search: ${query}` : "Search",
    description: query
      ? `Search results for "${query}" at Silver Looms.`
      : "Search kurtis, co-ord sets, and German silver at Silver Looms.",
    ...noIndexMetadata,
  };
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  return <SearchPage query={params.q ?? ""} />;
}
