import { Suspense } from "react";
import type { Metadata } from "next";
import ProductCard from "@/components/products/ProductCard";
import CategoryFilter from "@/components/products/CategoryFilter";
import FadeIn from "@/components/ui/FadeIn";
import { getProducts } from "@/lib/data";
import { getCategories, getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site";
import { Product } from "@/types/product";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  return {
    title: settings.collectionTitle || "Collection",
    description: settings.collectionSubtitle || settings.seoDescription,
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const category = params.category;
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const categories = await getCategories({ activeOnly: true }).catch(() => []);

  let items: Product[] = [];
  let error = false;
  try {
    items = await getProducts({ category });
  } catch {
    error = true;
  }

  return (
    <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="section-heading mb-3 sm:mb-4">
              Our <span className="text-gradient-gold">Collection</span>
            </h1>
            <p className="text-ld-silver max-w-xl mx-auto text-sm sm:text-base">
              {settings.collectionSubtitle}
            </p>
          </div>
        </FadeIn>

        <Suspense fallback={<div className="h-10" />}>
          <CategoryFilter categories={categories.map((item) => item.name)} />
        </Suspense>

        {error ? (
          <div className="text-center py-20">
            <p className="text-ld-silver mb-2">Unable to load items.</p>
            <p className="text-ld-silver text-sm">
              Please ensure MongoDB is connected and try again.
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ld-silver text-lg mb-2">No items found</p>
            <p className="text-ld-silver text-sm">
              {category
                ? `No items in the "${category}" category yet.`
                : "Check back soon for new arrivals."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item, index) => (
              <ProductCard
                key={item._id}
                product={item}
                index={index}
                whatsappNumber={settings.whatsappNumber}
                siteName={settings.siteName}
                siteUrl={settings.siteUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
