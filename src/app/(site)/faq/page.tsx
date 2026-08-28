import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Plus } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site";
import { buildPageMetadata, truncateAtWord } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const faqs = Array.isArray(settings.faqs) ? settings.faqs : [];

  // Lead with the real questions so the snippet previews actual content.
  const questions = faqs
    .slice(0, 3)
    .map((faq) => faq.question)
    .join(" ");
  // Drop the intro's trailing punctuation so it reads "…support: How long…".
  const intro = (settings.faqPageSubtitle || "Answers to common questions").replace(
    /[.:;,\s]+$/,
    ""
  );

  return buildPageMetadata({
    title: settings.faqPageTitle,
    description: truncateAtWord(
      questions ? `${intro}: ${questions}` : intro || settings.seoDescription
    ),
    path: "/faq",
    settings,
  });
}

export default async function FaqPage() {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const faqs = Array.isArray(settings.faqs) ? settings.faqs : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div className="pb-14 sm:pb-20">
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="border-b border-am-line bg-am-bg-alt">
        <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6 sm:py-14 lg:px-8">
          <FadeIn>
            <h1 className="section-heading">{settings.faqPageTitle}</h1>
            {settings.faqPageSubtitle && (
              <p className="mx-auto mt-3 max-w-xl text-sm text-am-ink-soft sm:text-base">
                {settings.faqPageSubtitle}
              </p>
            )}
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 lg:px-8">
        {faqs.length === 0 ? (
          <p className="rounded-2xl border border-am-line bg-am-card px-6 py-14 text-center text-sm text-am-muted">
            No questions have been published yet.
          </p>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FadeIn key={`${faq.question}-${index}`} delay={Math.min(index * 0.04, 0.3)}>
                <details className="group rounded-2xl border border-am-line bg-am-card open:border-am-gold/40">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 text-sm font-medium text-am-ink sm:p-6 sm:text-base">
                    <span>{faq.question}</span>
                    <Plus className="h-5 w-5 shrink-0 text-am-gold transition-transform duration-200 group-open:rotate-45" />
                  </summary>
                  <p className="border-t border-am-line px-5 pb-5 pt-4 text-sm leading-relaxed text-am-ink-soft sm:px-6 sm:pb-6 sm:text-base">
                    {faq.answer}
                  </p>
                </details>
              </FadeIn>
            ))}
          </div>
        )}

        <FadeIn delay={0.2}>
          <div className="mt-10 rounded-2xl border border-am-line bg-am-bg-alt p-6 text-center sm:p-8">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-am-ink sm:text-2xl">
              {settings.faqContactTitle}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-am-ink-soft">
              {settings.faqContactDescription}
            </p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              {settings.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-am-whatsapp px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f7f3d]"
                >
                  <MessageCircle className="h-4 w-4" />
                  {settings.whatsappChatLabel}
                </a>
              )}
              <Link href="/shipping-returns" className="btn-outline-gold px-6 py-3 text-sm">
                {settings.shippingPageTitle}
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
