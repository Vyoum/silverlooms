import { unstable_cache } from "next/cache";
import { assets } from "@/lib/constants/assets";
import { prisma } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/tags";

export const JEWELLERY_HERO_CONTENT_KEY = "jewellery_catalog_hero";

export type JewelleryHeroContent = {
  eyebrow: string;
  titleLine1: string;
  titleAccent: string;
  description: string;
  highlightOne: string;
  highlightTwo: string;
  imageUrl: string;
  imageAlt: string;
};

export const defaultJewelleryHeroContent: JewelleryHeroContent = {
  eyebrow: "Our Craft",
  titleLine1: "German Silver",
  titleAccent: "& Beyond",
  description:
    "Discover artisanal German silver, meticulously handcrafted by master artisans in Jaipur.",
  highlightOne: "German Silver",
  highlightTwo: "Anti-Tarnish Finish",
  imageUrl: assets.hero.jewellery,
  imageAlt: "Layered German silver necklaces editorial",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(
  patch: Record<string, unknown>,
  key: keyof JewelleryHeroContent,
  fallback: string,
) {
  const value = patch[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function mergeJewelleryHeroContent(patch: unknown): JewelleryHeroContent {
  if (!isRecord(patch)) return defaultJewelleryHeroContent;

  const defaults = defaultJewelleryHeroContent;
  return {
    eyebrow: readString(patch, "eyebrow", defaults.eyebrow),
    titleLine1: readString(patch, "titleLine1", defaults.titleLine1),
    titleAccent: readString(patch, "titleAccent", defaults.titleAccent),
    description: readString(patch, "description", defaults.description),
    highlightOne: readString(patch, "highlightOne", defaults.highlightOne),
    highlightTwo: readString(patch, "highlightTwo", defaults.highlightTwo),
    imageUrl: readString(patch, "imageUrl", defaults.imageUrl),
    imageAlt: readString(patch, "imageAlt", defaults.imageAlt),
  };
}

async function loadJewelleryHeroContent(): Promise<JewelleryHeroContent> {
  try {
    const row = await prisma.siteContent.findUnique({
      where: { key: JEWELLERY_HERO_CONTENT_KEY },
    });

    if (!row) return defaultJewelleryHeroContent;
    return mergeJewelleryHeroContent(row.value);
  } catch (error) {
    console.error("[site-content] Failed to load jewellery hero:", error);
    return defaultJewelleryHeroContent;
  }
}

export const getJewelleryHeroContent = unstable_cache(
  loadJewelleryHeroContent,
  ["jewellery-hero-content"],
  {
    tags: [CACHE_TAGS.jewelleryHero],
    revalidate: 300,
  },
);

export async function saveJewelleryHeroContent(content: JewelleryHeroContent) {
  return prisma.siteContent.upsert({
    where: { key: JEWELLERY_HERO_CONTENT_KEY },
    create: { key: JEWELLERY_HERO_CONTENT_KEY, value: content },
    update: { value: content },
  });
}
