import { HomePage } from "@/features/home/home-page";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "The Art of Wearing India",
  description:
    "Discover artisanal kurtis, co-ord sets, and handcrafted German silver jewellery from Jaipur. Woven in tradition, dressed in silver.",
  path: "/",
});

export default function Page() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <HomePage />
    </>
  );
}
