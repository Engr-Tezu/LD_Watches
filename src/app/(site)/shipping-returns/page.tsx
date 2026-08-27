import type { Metadata } from "next";
import Link from "next/link";
import { Truck, RotateCcw } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  return {
    title: "Shipping & Returns",
    description: `Learn about ${settings.siteName} shipping and return policies.`,
    alternates: { canonical: "/shipping-returns" },
  };
}

function PolicyBlock({
  title,
  content,
  icon: Icon,
}: {
  title: string;
  content: string;
  icon: typeof Truck;
}) {
  const paragraphs = content
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <section className="rounded-2xl border border-am-line bg-am-card p-6 sm:p-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-am-gold-tint text-am-gold">
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-am-ink sm:text-2xl">
          {title}
        </h2>
      </div>
      <div className="space-y-3">
        {paragraphs.map((paragraph, index) => (
          <p
            key={`${paragraph.slice(0, 40)}-${index}`}
            className="text-sm leading-relaxed text-am-ink-soft sm:text-base"
          >
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
    <div className="pb-14 sm:pb-20">
      <div className="border-b border-am-line bg-am-bg-alt">
        <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6 sm:py-14 lg:px-8">
          <FadeIn>
            <h1 className="section-heading">
              {settings.shippingPageTitle}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-am-ink-soft sm:text-base">
              {settings.shippingPageSubtitle}
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-6 px-4 pt-10 sm:px-6 lg:px-8">
        <FadeIn>
          <PolicyBlock
            icon={Truck}
            title={settings.shippingPolicyTitle}
            content={settings.shippingPolicyContent}
          />
        </FadeIn>
        <FadeIn delay={0.1}>
          <PolicyBlock
            icon={RotateCcw}
            title={settings.returnPolicyTitle}
            content={settings.returnPolicyContent}
          />
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="pt-2 text-center text-sm text-am-muted">
            Questions about an order?{" "}
            <Link href="/faq" className="font-medium text-am-gold hover:text-am-gold-deep">
              Read the FAQs
            </Link>{" "}
            or message us on WhatsApp.
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
