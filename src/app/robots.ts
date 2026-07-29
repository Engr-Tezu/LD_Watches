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
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
