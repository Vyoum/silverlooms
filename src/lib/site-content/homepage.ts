import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { defaultHomepageContent } from "./defaults";
import type { HomepageContent, HomepageShopByFabricContent, HomepageStyleTile } from "./types";
import { HOMEPAGE_CONTENT_KEY } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeSection<T extends Record<string, unknown>>(defaults: T, patch: unknown): T {
  if (!isRecord(patch)) return defaults;
  return { ...defaults, ...patch } as T;
}

function mergeShopByStyles(patch: unknown): HomepageStyleTile[] {
  const defaults = defaultHomepageContent.shopByStyles;
  if (!Array.isArray(patch)) return defaults;

  return defaults.map((item, index) =>
    mergeSection(item, patch[index]),
  );
}

function mergeShopByFabric(patch: unknown): HomepageShopByFabricContent {
  const defaults = defaultHomepageContent.shopByFabric;
  if (!isRecord(patch)) return defaults;

  const fabricsPatch = patch.fabrics;
  const fabrics = Array.isArray(fabricsPatch)
    ? defaults.fabrics.map((item, index) => mergeSection(item, fabricsPatch[index]))
    : defaults.fabrics;

  return {
    title:
      typeof patch.title === "string" && patch.title.trim()
        ? patch.title.trim()
        : defaults.title,
    subtitle:
      typeof patch.subtitle === "string" && patch.subtitle.trim()
        ? patch.subtitle.trim()
        : defaults.subtitle,
    fabrics,
  };
}

export function mergeHomepageContent(patch: unknown): HomepageContent {
  if (!isRecord(patch)) return defaultHomepageContent;

  return {
    announcement: mergeSection(defaultHomepageContent.announcement, patch.announcement),
    hero: mergeSection(defaultHomepageContent.hero, patch.hero),
    editorial: mergeSection(defaultHomepageContent.editorial, patch.editorial),
    brandStory: mergeSection(defaultHomepageContent.brandStory, patch.brandStory),
    shopByStyles: mergeShopByStyles(patch.shopByStyles),
    shopByFabric: mergeShopByFabric(patch.shopByFabric),
  };
}

async function loadHomepageContent(): Promise<HomepageContent> {
  try {
    const row = await prisma.siteContent.findUnique({
      where: { key: HOMEPAGE_CONTENT_KEY },
    });

    if (!row) return defaultHomepageContent;
    return mergeHomepageContent(row.value);
  } catch (error) {
    console.error("[site-content] Failed to load homepage content:", error);
    return defaultHomepageContent;
  }
}

export const getHomepageContent = unstable_cache(
  loadHomepageContent,
  ["homepage-content"],
  {
    tags: [CACHE_TAGS.homepage],
    revalidate: 300,
  },
);

export async function saveHomepageContent(content: HomepageContent) {
  return prisma.siteContent.upsert({
    where: { key: HOMEPAGE_CONTENT_KEY },
    create: { key: HOMEPAGE_CONTENT_KEY, value: content },
    update: { value: content },
  });
}
