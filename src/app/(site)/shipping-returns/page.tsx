import type { Metadata } from "next";
import FadeIn from "@/components/ui/FadeIn";
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  return {
    title: `Shipping & Returns | ${settings.siteName}`,
    description: `Learn about ${settings.siteName} shipping and return policies.`,
  };
}

function PolicyBlock({ title, content }: { title: string; content: string }) {
  const paragraphs = content
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <section className="space-y-4">
      <h2 className="text-ld-gold-light font-[family-name:var(--font-display)] text-2xl font-semibold">
        {title}
      </h2>
      <div className="space-y-3">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="text-white/90 text-sm sm:text-base leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

export default async function ShippingReturnsPage() {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);

  return (
    <div className="pt-24 sm:pt-28 pb-12 sm:pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="section-heading mb-3">
              Shipping <span className="text-gradient-gold">& Returns</span>
            </h1>
            <p className="text-ld-silver text-sm sm:text-base max-w-xl mx-auto">
              Clear information about delivery and our return process.
            </p>
            <div className="w-14 h-px bg-gradient-to-r from-transparent via-ld-gold/60 to-transparent mx-auto mt-4" />
          </div>
        </FadeIn>

        <div className="space-y-10 sm:space-y-12">
          <FadeIn>
            <PolicyBlock
              title={settings.shippingPolicyTitle}
              content={settings.shippingPolicyContent}
            />
          </FadeIn>
          <FadeIn delay={0.1}>
            <PolicyBlock
              title={settings.returnPolicyTitle}
              content={settings.returnPolicyContent}
            />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
