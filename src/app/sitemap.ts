import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data";
import { getCategories, getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const base = getSiteUrl(settings);

  const [products, categories] = await Promise.all([
    getProducts().catch(() => []),
    getCategories({ activeOnly: true }).catch(() => []),
  ]);

  // Most recent product edit stands in for "when did the shop last change".
  const latestProductUpdate = products.reduce<Date>((latest, product) => {
    const updated = product.updatedAt ? new Date(product.updatedAt) : null;
    return updated && !Number.isNaN(updated.getTime()) && updated > latest
      ? updated
      : latest;
  }, new Date(0));
  const shopUpdated =
    latestProductUpdate.getTime() > 0 ? latestProductUpdate : new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: shopUpdated, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/products`,
      lastModified: shopUpdated,
      changeFrequency: "daily",
      priority: 0.9,
    },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    {
      url: `${base}/shipping-returns`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Category listings are indexable facets, so they belong in the sitemap.
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${base}/products?category=${encodeURIComponent(category.name)}`,
    lastModified: shopUpdated,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => {
    const updated = product.updatedAt ? new Date(product.updatedAt) : null;
    return {
      url: `${base}/products/${product.slug}`,
      lastModified:
        updated && !Number.isNaN(updated.getTime()) ? updated : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
