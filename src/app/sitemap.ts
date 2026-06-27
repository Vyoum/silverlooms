import type { MetadataRoute } from "next";
import { listProducts } from "@/features/catalog/services/product-service";
import { JEWELLERY_CATEGORY_OPTIONS, JEWELLERY_MATERIAL_OPTIONS } from "@/features/jewellery/lib/jewellery-filters";
import { FALLBACK_CATALOG_CATEGORY_OPTIONS } from "@/features/kurtis/lib/kurtis-filters";
import { absoluteUrl } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listProducts();
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/kurtis"),
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/jewellery"),
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const kurtisCategoryRoutes: MetadataRoute.Sitemap =
    FALLBACK_CATALOG_CATEGORY_OPTIONS.map((category) => ({
      url: absoluteUrl(`/kurtis?category=${category.slug}`),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.75,
    }));

  const jewelleryCategoryRoutes: MetadataRoute.Sitemap =
    JEWELLERY_CATEGORY_OPTIONS.map((category) => ({
      url: absoluteUrl(`/jewellery?category=${category.slug}`),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.75,
    }));

  const jewelleryMaterialRoutes: MetadataRoute.Sitemap =
    JEWELLERY_MATERIAL_OPTIONS.map((material) => ({
      url: absoluteUrl(`/jewellery?material=${material.slug}`),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteUrl(`/product/${product.slug}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...kurtisCategoryRoutes,
    ...jewelleryCategoryRoutes,
    ...jewelleryMaterialRoutes,
    ...productRoutes,
  ];
}
