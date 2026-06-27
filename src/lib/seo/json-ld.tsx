import type { Product } from "@/lib/types/product";
import { BRAND_NAME } from "@/lib/constants/brand";
import { absoluteUrl } from "@/lib/seo/site";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/images/brand/logo-emblem.png"),
    sameAs: ["https://www.instagram.com/silverlooms_2026"],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(product: Product) {
  const images = [product.image, ...(product.images ?? [])].filter(Boolean);
  const availability =
    product.sizes && product.sizes.length === 0 ? "OutOfStock" : "InStock";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ??
      `${product.name} — ${product.category} at ${BRAND_NAME}.`,
    image: images.map((image) => absoluteUrl(image)),
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: BRAND_NAME,
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: "INR",
      price: product.price,
      availability: `https://schema.org/${availability}`,
      seller: {
        "@type": "Organization",
        name: BRAND_NAME,
      },
    },
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; href?: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}
