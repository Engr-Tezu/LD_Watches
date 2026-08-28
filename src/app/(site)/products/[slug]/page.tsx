import { notFound } from "next/navigation";
import ProductDetailView from "@/components/products/ProductDetailView";
import ProductGrid from "@/components/products/ProductGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import { getProductBySlug, getProducts } from "@/lib/data";
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site";
import { Product } from "@/types/product";
import { getProductPricing, getOrderedImages } from "@/lib/utils";
import { getProductLabels } from "@/types/site";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildPageMetadata,
  buildProductDescription,
  buildProductTitle,
  getSiteUrl,
} from "@/lib/seo";
import type { Metadata } from "next";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const { slug } = await params;
  const item = await getProductBySlug(slug).catch(() => null);

  if (!item) {
    return {
      title: "Product not found",
      description: "This product is no longer available.",
      robots: { index: false, follow: true },
    };
  }

  // Main image first so it is the one social platforms preview.
  const ordered = getOrderedImages(item);

  return buildPageMetadata({
    title: buildProductTitle(item),
    description: buildProductDescription(item, settings),
    path: `/products/${item.slug}`,
    settings,
    images: ordered.slice(0, 4).map((url) => ({ url, alt: item.name })),
  });
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const { slug } = await params;
  const item = await getProductBySlug(slug).catch(() => null);
  if (!item) notFound();

  let relatedItems: Product[] = [];
  try {
    const sameCategory = await getProducts({ category: item.category, limit: 9 });
    relatedItems = sameCategory.filter((product) => product._id !== item._id).slice(0, 4);
  } catch {
    relatedItems = [];
  }

  const siteUrl = getSiteUrl(settings);
  const pricing = getProductPricing(item);
  const productUrl = absoluteUrl(`/products/${item.slug}`, siteUrl);

  // Prices are quoted per-order over WhatsApp; a year is a safe validity hint.
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description: buildProductDescription(item, settings),
    image: getOrderedImages(item).map((url) => absoluteUrl(url, siteUrl)),
    sku: item._id,
    brand: { "@type": "Brand", name: item.brand },
    category: item.category,
    ...(item.features?.length
      ? {
          additionalProperty: item.features.map((feature) => ({
            "@type": "PropertyValue",
            name: "Feature",
            value: feature,
          })),
        }
      : {}),
    offers: {
      "@type": "Offer",
      price: pricing.price,
      priceCurrency: "PKR",
      priceValidUntil,
      itemCondition: "https://schema.org/NewCondition",
      availability: item.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: productUrl,
      seller: { "@type": "Organization", name: settings.siteName },
    },
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    [
      { name: settings.navHomeLabel, path: "/" },
      { name: settings.navCollectionLabel, path: "/products" },
      {
        name: item.category,
        path: `/products?category=${encodeURIComponent(item.category)}`,
      },
      { name: item.name, path: `/products/${item.slug}` },
    ],
    siteUrl
  );

  return (
    <div className="pb-28 pt-8 sm:pt-10 lg:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductDetailView
          product={item}
          labels={getProductLabels(settings)}
          homeLabel={settings.navHomeLabel}
          collectionLabel={settings.navCollectionLabel}
          whatsappNumber={settings.whatsappNumber}
          siteName={settings.siteName}
          siteUrl={settings.siteUrl}
        />

        {relatedItems.length > 0 && (
          <section className="mt-16 border-t border-am-line pt-10 sm:mt-20 sm:pt-14">
            <SectionHeading
              eyebrow="Same category"
              title={
                <>
                  More <span className="text-gradient-gold">{item.category}</span>
                </>
              }
              action={{
                href: `/products?category=${encodeURIComponent(item.category)}`,
                label: settings.viewAllLabel,
              }}
            />

            <div className="mt-8">
              <ProductGrid
                products={relatedItems}
                labels={getProductLabels(settings)}
                whatsappNumber={settings.whatsappNumber}
                siteName={settings.siteName}
                siteUrl={settings.siteUrl}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
