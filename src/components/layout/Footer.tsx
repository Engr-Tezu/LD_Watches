import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import SiteLogo from "@/components/ui/SiteLogo";
import { Category, SiteSettings } from "@/types/site";

export default function Footer({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  const categoryLinks = categories.slice(0, 6).map((category) => ({
    href: `/products?category=${encodeURIComponent(category.name)}`,
    label: category.name,
  }));

  const whatsappHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`
    : null;

  // Reuses the nav / page labels so the admin renames these in one place.
  const supportLinks = [
    { href: "/#faq", label: settings.navFaqLabel },
    { href: "/shipping-returns", label: settings.shippingPageTitle },
    { href: "/#reviews", label: settings.reviewsSectionTitle },
    { href: "/#about", label: settings.navAboutLabel },
  ];

  return (
    <footer className="bg-am-dark text-white/75">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Link href="/" className="-ml-1 mb-4 inline-flex items-center gap-0">
              <SiteLogo size="footer" logoUrl={settings.logoUrl} alt={settings.siteName} />
              <span className="-ml-1 font-[family-name:var(--font-display)] text-lg font-bold leading-tight text-white sm:-ml-1.5">
                {settings.siteName}
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/65">
              {settings.heroDescription}
            </p>

            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-am-whatsapp px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0f7f3d]"
              >
                <MessageCircle className="h-4 w-4" />
                {settings.whatsappChatLabel}
              </a>
            )}
          </div>

          <div className="md:col-span-3">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-am-gold-bright">
              {settings.footerShopHeading}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-white/65 transition-colors hover:text-am-gold-bright"
                >
                  {settings.footerAllProductsLabel}
                </Link>
              </li>
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors hover:text-am-gold-bright"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-am-gold-bright">
              {settings.footerSupportHeading}
            </h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors hover:text-am-gold-bright"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2.5">
              {settings.contactPhone && (
                <a
                  href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-2.5 text-sm text-white/65 transition-colors hover:text-am-gold-bright"
                >
                  <Phone className="h-4 w-4 shrink-0 text-am-gold-bright" />
                  {settings.contactPhone}
                </a>
              )}
              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-2.5 break-all text-sm text-white/65 transition-colors hover:text-am-gold-bright"
                >
                  <Mail className="h-4 w-4 shrink-0 text-am-gold-bright" />
                  {settings.contactEmail}
                </a>
              )}
              {settings.contactAddress && (
                <p className="flex items-center gap-2.5 text-sm text-white/65">
                  <MapPin className="h-4 w-4 shrink-0 text-am-gold-bright" />
                  {settings.contactAddress}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
