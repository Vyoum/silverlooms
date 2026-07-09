import type { Metadata } from "next";
import { HomePage } from "@/features/home/home-page";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getHomepageContent } from "@/lib/site-content/homepage";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomepageContent();
  const heroImage = content.hero.imageUrl?.trim();

  return pageMetadata({
    title: "The Art of Wearing India",
    description:
      "Discover artisanal kurtis, co-ord sets, and handcrafted German silver jewellery from Jaipur. Woven in tradition, dressed in silver.",
    path: "/",
    image: heroImage || undefined,
    imageAlt: content.hero.imageAlt || "Silver Looms — The Art of Wearing India",
  });
}

export default function Page() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <HomePage />
    </>
  );
}
