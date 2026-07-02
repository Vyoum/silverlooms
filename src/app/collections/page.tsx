import type { Metadata } from "next";
import { CollectionsPage } from "@/features/collections/collections-page";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Collections — Best Sellers",
  description:
    "Shop best-selling kurtis, co-ord sets, and German silver jewellery from Silver Looms. Curated favourites across apparel and jewellery.",
  path: "/collections",
  image: "/images/kurtis-hero.jpg",
});

export default function Page() {
  return <CollectionsPage />;
}
