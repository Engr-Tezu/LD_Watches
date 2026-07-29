import { notFound } from "next/navigation";
import Link from "next/link";
import ProductDetailView from "@/components/products/ProductDetailView";
import ProductCard from "@/components/products/ProductCard";
import FadeIn from "@/components/ui/FadeIn";
import { getProductBySlug, getProducts } from "@/lib/data";
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site";
import { Product } from "@/types/product";
import type { Metadata } from "next";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const { slug } = await params;
  const item = await getProductBySlug(slug);
  if (!item) return { title: `Item Not Found | ${settings.siteName}` };
  const description = item.description.slice(0, 160);
  const image = item.images?.[item.mainImageIndex ?? 0] || item.images?.[0] || settings.seoOgImage;
  return {
    title: item.name,
    description,
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
  const item = await getProductBySlug(slug);
  if (!item) notFound();

  let relatedItems: Product[] = [];
  try {
    const allInCategory = await getProducts({ category: item.category });
    relatedItems = allInCategory.filter((p) => p._id !== item._id);
  } catch {
    relatedItems = [];
  }

  return (
    <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductDetailView
          product={item}
          whatsappNumber={settings.whatsappNumber}
          siteName={settings.siteName}
          siteUrl={settings.siteUrl}
        />

        {relatedItems.length > 0 && (
          <section className="mt-16 sm:mt-24 pt-10 sm:pt-14 border-t border-ld-grey/30">
            <FadeIn>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8 sm:mb-10">
                <div>
                  <p className="text-ld-gold-light text-xs uppercase tracking-widest font-medium mb-2">
                    Same Category
                  </p>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    More <span className="text-gradient-gold">{item.category}</span> Products
                  </h2>
                </div>
                <Link
                  href={`/products?category=${encodeURIComponent(item.category)}`}
                  className="text-ld-silver hover:text-ld-gold-light text-sm transition-colors"
                >
                  View all {item.category} →
                </Link>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {relatedItems.slice(0, 8).map((related, index) => (
                <ProductCard
                  key={related._id}
                  product={related}
                  index={index}
                  whatsappNumber={settings.whatsappNumber}
                  siteName={settings.siteName}
                  siteUrl={settings.siteUrl}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
