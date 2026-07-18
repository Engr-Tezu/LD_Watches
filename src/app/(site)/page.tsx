import Link from "next/link";
import { SITE_NAME } from "@/lib/brand";
import HeroSection from "@/components/home/HeroSection";
import WatchCard from "@/components/watches/WatchCard";
import FadeIn from "@/components/ui/FadeIn";
import { getWatches } from "@/lib/data";
import { Watch } from "@/types/watch";
import { ArrowRight, Gem, Sparkles, ShieldCheck } from "lucide-react";

export default async function HomePage() {
  let featuredWatches: Watch[] = [];

  try {
    featuredWatches = await getWatches({ featured: true, limit: 4 });
    if (featuredWatches.length === 0) {
      featuredWatches = await getWatches({ limit: 4 });
    }
  } catch {
    featuredWatches = [];
  }

  return (
    <>
      <HeroSection />

      {featuredWatches.length > 0 && (
        <section className="pt-8 sm:pt-10 pb-10 sm:pb-12 bg-ld-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="section-heading mb-2">
                  Featured <span className="text-gradient-gold">Collection</span>
                </h2>
                <p className="text-ld-silver text-sm sm:text-base max-w-lg mx-auto">
                  Handpicked timepieces for the distinguished
                </p>
                <div className="w-14 h-px bg-gradient-to-r from-transparent via-ld-gold/60 to-transparent mx-auto mt-4" />
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredWatches.map((watch, index) => (
                <WatchCard key={watch._id} watch={watch} index={index} />
              ))}
            </div>

            <FadeIn delay={0.2}>
              <div className="mt-8 sm:mt-10 flex justify-center">
                <Link
                  href="/watches"
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
                Welcome to <span className="text-gradient-gold">{SITE_NAME}</span>
              </h2>
              <div className="w-14 h-px bg-gradient-to-r from-transparent via-ld-gold/60 to-transparent mx-auto mt-4" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: Sparkles,
                title: "Our Philosophy",
                description:
                  "A watch is more than a way to tell time. It reflects your personality, confidence, and style. We deliver premium timepieces with timeless elegance and modern craftsmanship.",
              },
              {
                icon: Gem,
                title: "Curated Collection",
                description:
                  "Every watch is carefully selected for outstanding design, durability, and comfort. From business meetings to special occasions, find the perfect piece for any moment.",
              },
              {
                icon: ShieldCheck,
                title: "Our Commitment",
                description:
                  "Your satisfaction drives everything we do. We offer a seamless shopping experience, trusted quality, and dedicated support from the moment you browse to the moment it arrives.",
              },
            ].map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.1}>
                <div className="glass-panel rounded-2xl p-6 sm:p-7 h-full flex flex-col items-center text-center gold-glow-hover">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ld-gold/10 mb-5">
                    <item.icon className="w-6 h-6 text-ld-gold" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-3">{item.title}</h3>
                  <p className="text-ld-silver text-sm sm:text-base leading-relaxed flex-1 max-w-sm">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <p className="text-ld-gold-light font-[family-name:var(--font-display)] text-base sm:text-lg font-semibold text-center mt-8 sm:mt-10">
              Timeless Elegance. Crafted for Every Moment.
            </p>
          </FadeIn>
        </div>
      </section>
      <section id="contact" className="py-10 sm:py-12 bg-ld-dark border-t border-ld-grey/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="section-heading mb-3 sm:mb-4">
              Ready to Find Your <span className="text-gradient-gold">Perfect Watch</span>?
            </h2>
            <p className="text-ld-silver mb-6 sm:mb-8 text-sm sm:text-base px-2">
              Browse our collection and reach out via WhatsApp for instant assistance.
              We&apos;re here to help you make the perfect choice.
            </p>
            <Link href="/watches" className="btn-gold px-8 py-3.5 sm:py-4 gold-glow text-sm sm:text-base">
              Start Shopping <ArrowRight className="w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
