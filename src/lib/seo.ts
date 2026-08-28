import type { Metadata } from "next";
import { Product } from "@/types/product";
import { SiteSettings } from "@/types/site";
import { formatPrice, getProductPricing } from "@/lib/utils";

/** Google truncates around 160 characters; stay just under. */
const MAX_DESCRIPTION = 155;

export function getSiteUrl(settings: Pick<SiteSettings, "siteUrl">): string {
  return (settings.siteUrl || "http://localhost:3000").replace(/\/$/, "");
}

/** Resolves a site-relative path against the configured site URL. */
export function absoluteUrl(path: string, base: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

/** Collapses newlines and repeated whitespace into single spaces. */
export function cleanText(value: string): string {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Truncates on a word boundary so descriptions never end mid-word. */
export function truncateAtWord(value: string, max = MAX_DESCRIPTION): string {
  const text = cleanText(value);
  if (text.length <= max) return text;
  const clipped = text.slice(0, max - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? clipped.slice(0, lastSpace) : clipped).replace(/[,;:.\-\s]+$/, "")}…`;
}

/**
 * Meta description for a product: the merchant's own copy where it exists,
 * otherwise a sentence built from the product's real attributes. Never a
 * generic site-wide blurb — the description has to describe *this* product.
 */
export function buildProductDescription(
  product: Product,
  settings: Pick<SiteSettings, "siteName">
): string {
  const own = cleanText(product.shortDescription || product.description);
  if (own.length >= 50) return truncateAtWord(own);

  const pricing = getProductPricing(product);
  const parts = [
    own || `${product.name} by ${product.brand}.`,
    `${product.category} available at ${settings.siteName}.`,
    pricing.discount > 0
      ? `Now ${formatPrice(pricing.price)} (${pricing.discount}% off).`
      : `${formatPrice(pricing.price)}.`,
    product.inStock ? "In stock — order on WhatsApp." : "Currently out of stock.",
  ];

  return truncateAtWord(parts.filter(Boolean).join(" "));
}

/** Title for a product page. The layout template appends the site name. */
export function buildProductTitle(product: Product): string {
  const name = cleanText(product.name);
  const brand = cleanText(product.brand);
  // Avoid "Rolex Submariner — Rolex" when the brand is already in the name.
  if (!brand || name.toLowerCase().includes(brand.toLowerCase())) return name;
  return `${name} — ${brand}`;
}

interface PageMetadataInput {
  title: string;
  description: string;
  /** Site-relative canonical path, e.g. "/products". */
  path: string;
  settings: SiteSettings;
  images?: Array<{ url: string; alt?: string }>;
  /** Search/filter permutations should be crawlable but not indexed. */
  noIndex?: boolean;
  /** OpenGraph type; product pages read better as "website" for Next's typing. */
  ogType?: "website" | "article";
}

/**
 * Single place that assembles canonical + OpenGraph + Twitter so every page
 * is consistent and no page silently inherits another page's canonical.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  settings,
  images,
  noIndex = false,
  ogType = "website",
}: PageMetadataInput): Metadata {
  const base = getSiteUrl(settings);
  const canonical = absoluteUrl(path, base);
  const fallbackImage = settings.seoOgImage || settings.logoUrl;

  const ogImages = (images?.length
    ? images
    : fallbackImage
      ? [{ url: fallbackImage, alt: settings.siteName }]
      : []
  ).map((image) => ({
    url: absoluteUrl(image.url, base),
    alt: image.alt || title,
  }));

  return {
    title,
    description,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: ogType,
      locale: "en_US",
      url: canonical,
      siteName: settings.siteName,
      title,
      description,
      images: ogImages.length ? ogImages : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.length ? ogImages.map((image) => image.url) : undefined,
    },
  };
}

/** Shared JSON-LD breadcrumb builder. */
export function buildBreadcrumbJsonLd(
  trail: Array<{ name: string; path: string }>,
  base: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path, base),
    })),
  };
}
