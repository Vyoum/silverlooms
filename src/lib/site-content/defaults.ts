import { assets } from "@/lib/constants/assets";
import type { HomepageContent } from "./types";

export const defaultHomepageContent: HomepageContent = {
  announcement: {
    text: "Free shipping on orders above ₹5000",
    linkText: "Shop Now",
    linkHref: "/kurtis",
  },
  hero: {
    eyebrow: "The Heritage Collection",
    titleLine1: "The Art of",
    titleAccent: "Wearing",
    titleLine2: "India",
    subtitle:
      "Discover artisanal apparel and silver jewellery for the modern aesthete.",
    primaryCtaLabel: "Shop Apparel",
    primaryCtaHref: "/kurtis",
    secondaryCtaLabel: "Shop Jewellery",
    secondaryCtaHref: "/jewellery",
    imageUrl: assets.hero.home,
    imageAlt: "Woman in premium terracotta Anarkali suit",
  },
  editorial: {
    eyebrow: "The Editorial Edit",
    title: "Curated Elegance for the Modern Soul",
    body:
      "Our editorial collections are a testament to the enduring beauty of Indian craftsmanship. Each piece is selected not just for its aesthetic appeal, but for the story it tells—a narrative of heritage, patience, and the pursuit of perfection.",
    linkText: "View the Lookbook",
    linkHref: "/kurtis",
    imageUrl: assets.editorial.lookbook,
    imageAlt: "Editorial fashion showcase",
  },
  brandStory: {
    quote:
      "Every thread carries the whispers of generations—woven with patience, worn with pride.",
    captionEyebrow: "Threads of Paradise",
    captionTitle: "Midnight Kari Grace",
    imageUrl: assets.editorial.brandStory,
    imageAlt: "Editorial fashion portrait",
  },
  shopByStyles: [
    {
      name: "Threads of Paradise",
      imageUrl: assets.styles.threadsOfParadise,
      imageAlt: "Threads of Paradise",
      href: "/kurtis",
    },
    {
      name: "Midnight Kari Grace",
      imageUrl: assets.styles.midnightKariGrace,
      imageAlt: "Midnight Kari Grace",
      href: "/kurtis",
    },
    {
      name: "Whispers of Charm",
      imageUrl: assets.styles.whispersOfCharm,
      imageAlt: "Whispers of Charm",
      href: "/kurtis",
    },
  ],
};
