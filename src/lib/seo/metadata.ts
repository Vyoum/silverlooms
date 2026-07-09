import type { Metadata } from "next";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
} from "@/lib/constants/brand";
import { absoluteUrl, SITE_URL } from "@/lib/seo/site";

export const DEFAULT_OG_IMAGE_PATH = "/images/og/preview.jpg";

const defaultDescription =
  "Shop artisanal kurtis, co-ord sets, and handcrafted German silver jewellery from Jaipur. Free shipping across India at Silver Looms.";

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: defaultDescription,
  keywords: [
    "Silver Looms",
    "Indian kurtis",
    "co-ord sets",
    "German silver jewellery",
    "Jaipur jewellery",
    "handcrafted silver",
    "ethnic wear India",
    "anti-tarnish jewellery",
  ],
  authors: [{ name: BRAND_NAME, url: SITE_URL }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    description: defaultDescription,
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
        width: 1200,
        height: 630,
        alt: `${BRAND_NAME} — ${BRAND_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    description: defaultDescription,
    images: [absoluteUrl(DEFAULT_OG_IMAGE_PATH)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const noIndexMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = image ? absoluteUrl(image) : absoluteUrl(DEFAULT_OG_IMAGE_PATH);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${title} | ${BRAND_NAME}`,
      description,
      url: canonical,
      images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: imageAlt ?? title,
      },
    ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${BRAND_NAME}`,
      description,
      images: [ogImage],
    },
    ...(noIndex ? noIndexMetadata : {}),
  };
}
