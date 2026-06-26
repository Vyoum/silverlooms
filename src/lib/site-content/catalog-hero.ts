import { unstable_cache } from "next/cache";
import { assets } from "@/lib/constants/assets";
import type { ProductSort } from "@/features/catalog/lib/product-sort";
import { prisma } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/tags";

export const APPAREL_CATALOG_HEROES_KEY = "apparel_catalog_heroes";

export type CatalogHeroContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageUrl: string;
};

export type ApparelCatalogHeroes = Record<ProductSort, CatalogHeroContent>;

export const defaultApparelCatalogHeroes: ApparelCatalogHeroes = {
  all: {
    eyebrow: "Collections",
    title: "Kurtis & Sets",
    subtitle: "Curated apparel · New arrivals every week",
    imageUrl: assets.hero.kurtis,
  },
  bestseller: {
    eyebrow: "Best Selling",
    title: "Best Sellers",
    subtitle: "Our most loved pieces across the store",
    imageUrl: assets.hero.kurtis,
  },
  new: {
    eyebrow: "New Arrivals",
    title: "New Arrivals",
    subtitle: "Fresh from our atelier — limited pieces",
    imageUrl: assets.hero.kurtis,
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeHero(
  defaults: CatalogHeroContent,
  patch: unknown,
): CatalogHeroContent {
  if (!isRecord(patch)) return defaults;

  return {
    eyebrow:
      typeof patch.eyebrow === "string" && patch.eyebrow.trim()
        ? patch.eyebrow.trim()
        : defaults.eyebrow,
    title:
      typeof patch.title === "string" && patch.title.trim()
        ? patch.title.trim()
        : defaults.title,
    subtitle:
      typeof patch.subtitle === "string" && patch.subtitle.trim()
        ? patch.subtitle.trim()
        : defaults.subtitle,
    imageUrl:
      typeof patch.imageUrl === "string" && patch.imageUrl.trim()
        ? patch.imageUrl.trim()
        : defaults.imageUrl,
  };
}

export function mergeApparelCatalogHeroes(patch: unknown): ApparelCatalogHeroes {
  if (!isRecord(patch)) return defaultApparelCatalogHeroes;

  return {
    all: mergeHero(defaultApparelCatalogHeroes.all, patch.all),
    bestseller: mergeHero(defaultApparelCatalogHeroes.bestseller, patch.bestseller),
    new: mergeHero(defaultApparelCatalogHeroes.new, patch.new),
  };
}

async function loadApparelCatalogHeroes(): Promise<ApparelCatalogHeroes> {
  try {
    const row = await prisma.siteContent.findUnique({
      where: { key: APPAREL_CATALOG_HEROES_KEY },
    });

    if (!row) return defaultApparelCatalogHeroes;
    return mergeApparelCatalogHeroes(row.value);
  } catch (error) {
    console.error("[site-content] Failed to load catalog heroes:", error);
    return defaultApparelCatalogHeroes;
  }
}

export const getApparelCatalogHeroes = unstable_cache(
  loadApparelCatalogHeroes,
  ["catalog-heroes"],
  {
    tags: [CACHE_TAGS.catalogHeroes],
    revalidate: 300,
  },
);

export async function saveApparelCatalogHeroes(content: ApparelCatalogHeroes) {
  return prisma.siteContent.upsert({
    where: { key: APPAREL_CATALOG_HEROES_KEY },
    create: { key: APPAREL_CATALOG_HEROES_KEY, value: content },
    update: { value: content },
  });
}
