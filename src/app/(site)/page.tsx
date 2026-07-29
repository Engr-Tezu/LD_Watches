import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import HomeFaqSection from "@/components/home/HomeFaqSection";
import ProductCard from "@/components/products/ProductCard";
import FadeIn from "@/components/ui/FadeIn";
import { getProducts } from "@/lib/data";
import { getReviews, getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site";
import { AboutBlock } from "@/types/site";
import { Product } from "@/types/product";
import { ArrowRight, Gem, Sparkles, ShieldCheck } from "lucide-react";

type AboutRenderItem =
  | { kind: "heading" | "paragraph"; block: AboutBlock; key: string }
  | { kind: "cards"; cards: AboutBlock[]; key: string };

const CARD_ICONS = [Sparkles, Gem, ShieldCheck];

function groupAboutBlocks(blocks: AboutBlock[]): AboutRenderItem[] {
  const items: AboutRenderItem[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    if (block.type === "card") {
      const cards: AboutBlock[] = [];
      while (i < blocks.length && blocks[i].type === "card") {
        cards.push(blocks[i]);
        i += 1;
      }
      items.push({ kind: "cards", cards, key: `cards-${items.length}` });
      continue;
    }

    items.push({
      kind: block.type,
      block,
      key: `${block.type}-${i}`,
    });
    i += 1;
  }

  return items;
}

export default async function HomePage() {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  let featuredItems: Product[] = [];
  try {
    featuredItems = await getProducts({ featured: true, limit: 4 });
    if (featuredItems.length === 0) featuredItems = await getProducts({ limit: 4 });
  } catch {}

  const reviews = await getReviews({ activeOnly: true, featuredOnly: true }).catch(() => []);

  const aboutItems = groupAboutBlocks(
    Array.isArray(settings.aboutBlocks) ? settings.aboutBlocks : []
  );

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
      <HeroSection settings={settings} />

      {featuredItems.length > 0 && (
        <section className="pt-8 sm:pt-10 pb-10 sm:pb-12 bg-ld-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="section-heading mb-2">
                  {settings.collectionTitle.split(" ").slice(0, -1).join(" ") || "Featured"}{" "}
                  <span className="text-gradient-gold">
                    {settings.collectionTitle.split(" ").slice(-1).join(" ") || "Collection"}
                  </span>
                </h2>
                <p className="text-ld-silver text-sm sm:text-base max-w-lg mx-auto">
                  {settings.collectionSubtitle}
                </p>
                <div className="w-14 h-px bg-gradient-to-r from-transparent via-ld-gold/60 to-transparent mx-auto mt-4" />
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredItems.map((item, index) => (
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

            <FadeIn delay={0.2}>
              <div className="mt-8 sm:mt-10 flex justify-center">
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full glass-panel border border-ld-gold/25 hover:border-ld-gold/50 hover:bg-ld-gold/5 transition-all duration-300"
                >
                  <span className="text-ld-gold-light font-semibold text-sm sm:text-base">
                    View Full Collection
                  </span>
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ld-gold text-[#1a1200] group-hover:bg-ld-gold-light transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      <section id="about" className="py-10 sm:py-12 bg-ld-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="section-heading mb-2">
                {settings.aboutTitle.includes(settings.siteName) ? (
                  <>
                    {settings.aboutTitle.split(settings.siteName)[0] || "Welcome to "}
                    <span className="text-gradient-gold">{settings.siteName}</span>
                    {settings.aboutTitle.split(settings.siteName)[1] || ""}
                  </>
                ) : (
                  settings.aboutTitle
                )}
              </h2>
              <div className="w-14 h-px bg-gradient-to-r from-transparent via-ld-gold/60 to-transparent mx-auto mt-4" />
            </div>
          </FadeIn>

          <div className="space-y-6 sm:space-y-8">
            {aboutItems.map((item, itemIndex) => {
              if (item.kind === "cards") {
                return (
                  <div
                    key={item.key}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                  >
                    {item.cards.map((card, cardIndex) => {
                      const Icon = CARD_ICONS[cardIndex % CARD_ICONS.length];
                      return (
                        <FadeIn key={`${item.key}-${cardIndex}`} delay={cardIndex * 0.1}>
                          <div className="glass-panel rounded-2xl p-6 sm:p-7 h-full flex flex-col items-center text-center gold-glow-hover">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ld-gold/10 mb-5">
                              <Icon className="w-6 h-6 text-ld-gold" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-3">{card.text}</h3>
                            {card.description && (
                              <p className="text-ld-silver text-sm sm:text-base leading-relaxed flex-1 max-w-sm">
                                {card.description}
                              </p>
                            )}
                          </div>
                        </FadeIn>
                      );
                    })}
                  </div>
                );
              }

              if (item.kind === "heading") {
                return (
                  <FadeIn key={item.key} delay={Math.min(itemIndex * 0.05, 0.3)}>
                    <h3 className="text-ld-gold-light font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold text-center max-w-3xl mx-auto">
                      {item.block.text}
                    </h3>
                  </FadeIn>
                );
              }

              return (
                <FadeIn key={item.key} delay={Math.min(itemIndex * 0.05, 0.3)}>
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed text-center max-w-3xl mx-auto">
                    {item.block.text}
                  </p>
                </FadeIn>
              );
            })}
          </div>

          {settings.aboutTagline && (
            <FadeIn delay={0.3}>
              <p className="text-ld-gold-light font-[family-name:var(--font-display)] text-base sm:text-lg font-semibold text-center mt-8 sm:mt-10">
                {settings.aboutTagline}
              </p>
            </FadeIn>
          )}
        </div>
      </section>

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

      <section id="contact" className="py-10 sm:py-12 bg-ld-dark border-t border-ld-grey/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="section-heading mb-3 sm:mb-4">{settings.contactSectionTitle}</h2>
            <p className="text-ld-silver mb-6 sm:mb-8 text-sm sm:text-base px-2">
              {settings.contactSectionDescription}
            </p>
            <Link
              href="/products"
              className="btn-gold px-8 py-3.5 sm:py-4 gold-glow text-sm sm:text-base"
            >
              {settings.contactButtonLabel} <ArrowRight className="w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
