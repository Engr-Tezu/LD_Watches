import type { MetadataRoute } from "next";
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const base = (settings.siteUrl || "http://localhost:3000").replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Admin and API are never useful in results. Sort/stock refinements
        // are duplicates of the canonical listing, so keep them out of the
        // crawl budget; search URLs are additionally noindex'd on the page.
        disallow: [
          "/admin",
          "/api",
          "/products?*sort=",
          "/products?*stock=",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
