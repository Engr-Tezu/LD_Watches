import type { Metadata } from "next";
import FadeIn from "@/components/ui/FadeIn";
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  return {
    title: `${settings.faqPageTitle} | ${settings.siteName}`,
    description: settings.faqPageSubtitle || settings.seoDescription,
  };
}

export default async function FaqPage() {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const faqs = Array.isArray(settings.faqs) ? settings.faqs : [];

  return (
    <div className="pt-24 sm:pt-28 pb-12 sm:pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="section-heading mb-3">{settings.faqPageTitle}</h1>
            {settings.faqPageSubtitle && (
              <p className="text-ld-silver text-sm sm:text-base max-w-xl mx-auto">
                {settings.faqPageSubtitle}
              </p>
            )}
            <div className="w-14 h-px bg-gradient-to-r from-transparent via-ld-gold/60 to-transparent mx-auto mt-4" />
          </div>
        </FadeIn>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FadeIn key={`${faq.question}-${index}`} delay={Math.min(index * 0.05, 0.3)}>
              <details className="group glass-panel rounded-2xl p-5 sm:p-6 open:border-ld-gold/30">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 text-white font-medium">
                  <span>{faq.question}</span>
                  <span className="text-ld-gold shrink-0 group-open:rotate-45 transition-transform text-xl leading-none">
                    +
                  </span>
                </summary>
                <p className="text-ld-silver text-sm sm:text-base leading-relaxed mt-4 pt-4 border-t border-ld-grey/30">
                  {faq.answer}
                </p>
              </details>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
