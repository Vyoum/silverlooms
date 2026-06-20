import type { Metadata } from "next";
import { SearchPage } from "@/features/search/search-page";
import { BRAND_NAME } from "@/lib/constants/brand";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q?.trim();

  return {
    title: query
      ? `Search: ${query} | ${BRAND_NAME}`
      : `Search | ${BRAND_NAME}`,
  };
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  return <SearchPage query={params.q ?? ""} />;
}
