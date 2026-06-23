import { prisma } from "@/lib/db";
import { defaultHomepageContent } from "./defaults";
import type { HomepageContent } from "./types";
import { HOMEPAGE_CONTENT_KEY } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeSection<T extends Record<string, unknown>>(defaults: T, patch: unknown): T {
  if (!isRecord(patch)) return defaults;
  return { ...defaults, ...patch } as T;
}

export function mergeHomepageContent(patch: unknown): HomepageContent {
  if (!isRecord(patch)) return defaultHomepageContent;

  return {
    announcement: mergeSection(defaultHomepageContent.announcement, patch.announcement),
    hero: mergeSection(defaultHomepageContent.hero, patch.hero),
    editorial: mergeSection(defaultHomepageContent.editorial, patch.editorial),
    brandStory: mergeSection(defaultHomepageContent.brandStory, patch.brandStory),
  };
}

export async function getHomepageContent(): Promise<HomepageContent> {
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

export async function saveHomepageContent(content: HomepageContent) {
  return prisma.siteContent.upsert({
    where: { key: HOMEPAGE_CONTENT_KEY },
    create: { key: HOMEPAGE_CONTENT_KEY, value: content },
    update: { value: content },
  });
}
