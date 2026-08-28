import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import AllProductsSection from "@/components/home/AllProductsSection";
import AboutSection from "@/components/home/AboutSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import HomeFaqSection from "@/components/home/HomeFaqSection";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import { getProducts, getCategoryShowcase } from "@/lib/data";
import {
  getCategories,
  getReviews,
  getSiteSettings,
  DEFAULT_SITE_SETTINGS,
} from "@/lib/site";
import { getProductLabels } from "@/types/site";
import { Product } from "@/types/product";

/** Splits a heading so the last word can carry the gold gradient. */
function splitHeading(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return { head: "", tail: "" };
  if (words.length === 1) return { head: "", tail: words[0] };
  const tail = words.pop() as string;
  return { head: words.join(" "), tail };
}

export default async function HomePage() {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);

  const [featured, latest, showcase, categories, reviews] = await Promise.all([
    getProducts({ featured: true, limit: 12 }).catch(() => [] as Product[]),
    getProducts({ limit: 12, sort: "newest" }).catch(() => [] as Product[]),
    getCategoryShowcase().catch(() => []),
    getCategories({ activeOnly: true }).catch(() => []),
    getReviews({ activeOnly: true, featuredOnly: true }).catch(() => []),
  ]);

  // With nothing flagged as featured, fall back to the newest items so the
  // slider never renders empty.
  const featuredItems = featured.length ? featured : latest;

  const productLabels = getProductLabels(settings);
  const collection = splitHeading(settings.collectionTitle);
  const allProducts = splitHeading(settings.allProductsTitle);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName,
    url: settings.siteUrl,
    logo: settings.seoOgImage || settings.logoUrl,
    description: settings.seoDescription,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.contactPhone,
      email: settings.contactEmail,
      contactType: "customer service",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroBanner settings={settings} />

      <CategoryShowcase
        categories={showcase}
        title={settings.categoriesSectionTitle}
        subtitle={settings.categoriesSectionSubtitle}
      />

      {featuredItems.length > 0 && (
        <section id="featured" className="border-t border-am-line bg-am-bg-alt py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={
                <>
                  {collection.head}{" "}
                  <span className="text-gradient-gold">{collection.tail}</span>
                </>
              }
              subtitle={settings.collectionSubtitle}
            />

            <div className="mt-8">
              <FeaturedCarousel
                products={featuredItems}
                labels={productLabels}
                ariaLabel={settings.collectionTitle}
                whatsappNumber={settings.whatsappNumber}
                siteName={settings.siteName}
                siteUrl={settings.siteUrl}
              />
            </div>

            <FadeIn delay={0.2}>
              <div className="mt-10 flex justify-center">
                <Link href="/products" className="btn-dark px-8 py-3.5 text-sm sm:text-base">
                  {settings.featuredButtonLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      <AllProductsSection
        title={
          <>
            {allProducts.head}{" "}
            <span className="text-gradient-gold">{allProducts.tail}</span>
          </>
        }
        subtitle={settings.allProductsSubtitle}
        categories={categories.map((category) => category.name)}
        labels={productLabels}
        whatsappNumber={settings.whatsappNumber}
        siteName={settings.siteName}
        siteUrl={settings.siteUrl}
      />

      <AboutSection settings={settings} />

      <TestimonialsSection
        title={settings.reviewsSectionTitle}
        subtitle={settings.reviewsSectionSubtitle}
        reviews={reviews}
      />

      <HomeFaqSection
        title={settings.faqPageTitle}
        subtitle={settings.faqPageSubtitle}
        faqs={Array.isArray(settings.faqs) ? settings.faqs : []}
        faqImageUrl={settings.faqImageUrl}
      />

      <section id="contact" className="bg-am-dark py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              {settings.contactSectionTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              {settings.contactSectionDescription}
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-am-gold-bright px-8 py-3.5 text-sm font-semibold text-am-dark transition-colors hover:bg-[#e5bc45] sm:text-base"
              >
                {settings.contactButtonLabel}
                <ArrowRight className="h-5 w-5" />
              </Link>
              {settings.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5 sm:text-base"
                >
                  <MessageCircle className="h-5 w-5" />
                  {settings.whatsappChatLabel}
                </a>
              )}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
