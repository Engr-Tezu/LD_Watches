import { notFound } from "next/navigation";
import ProductDetailView from "@/components/products/ProductDetailView";
import ProductGrid from "@/components/products/ProductGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import { getProductBySlug, getProducts } from "@/lib/data";
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site";
import { Product } from "@/types/product";
import { getProductPricing } from "@/lib/utils";
import { getProductLabels } from "@/types/site";
import type { Metadata } from "next";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const { slug } = await params;
  const item = await getProductBySlug(slug).catch(() => null);
  if (!item) return { title: `Item Not Found | ${settings.siteName}` };
  const description = item.description.slice(0, 160);
  const image = item.images?.[item.mainImageIndex ?? 0] || item.images?.[0] || settings.seoOgImage;
  return {
    title: item.name,
    description,
    alternates: { canonical: `/products/${item.slug}` },
    openGraph: {
      title: `${item.name} | ${settings.siteName}`,
      description,
      type: "website",
      images: image ? [{ url: image, alt: item.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: item.name,
      description,
      images: image ? [image] : undefined,
    },
  };
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

  const siteUrl = (settings.siteUrl || "").replace(/\/$/, "");
  const pricing = getProductPricing(item);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description: item.description,
    image: item.images?.length ? item.images : undefined,
    brand: { "@type": "Brand", name: item.brand },
    category: item.category,
    offers: {
      "@type": "Offer",
      price: pricing.price,
      priceCurrency: "PKR",
      availability: item.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: siteUrl ? `${siteUrl}/products/${item.slug}` : undefined,
    },
  };

  return (
    <div className="pb-28 pt-8 sm:pt-10 lg:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
