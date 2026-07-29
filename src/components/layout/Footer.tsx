import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import SiteLogo from "@/components/ui/SiteLogo";
import { Category, SiteSettings } from "@/types/site";

export default function Footer({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  const quickLinks = categories.slice(0, 3).map((category) => ({
    href: `/products?category=${encodeURIComponent(category.name)}`,
    label: category.name,
  }));

  return (
    <footer className="bg-ld-dark border-t border-ld-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-0 mb-4 -ml-1">
              <SiteLogo size="footer" logoUrl={settings.logoUrl} alt={settings.siteName} />
              <span className="font-[family-name:var(--font-display)] text-lg font-bold text-white leading-tight -ml-1 sm:-ml-1.5">
                {settings.siteName}
              </span>
            </Link>
            <p className="text-ld-silver text-sm leading-relaxed max-w-sm">
              {settings.heroDescription}
            </p>
          </div>

          <div>
            <h3 className="text-ld-gold font-semibold mb-4 uppercase tracking-wider text-sm">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-ld-silver hover:text-ld-gold transition-colors text-sm"
                >
                  Collection
                </Link>
              </li>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ld-silver hover:text-ld-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#about"
                  className="text-ld-silver hover:text-ld-gold transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-ld-gold font-semibold mb-4 uppercase tracking-wider text-sm">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#faq"
                  className="text-ld-silver hover:text-ld-gold transition-colors text-sm"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-returns"
                  className="text-ld-silver hover:text-ld-gold transition-colors text-sm"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/#reviews"
                  className="text-ld-silver hover:text-ld-gold transition-colors text-sm"
                >
                  Reviews
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-ld-grey/50 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-x-6 sm:gap-y-2">
            {settings.contactPhone && (
              <a
                href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 text-ld-silver hover:text-ld-gold transition-colors text-sm"
              >
                <Phone className="w-4 h-4 text-ld-gold shrink-0" />
                {settings.contactPhone}
              </a>
            )}
            {settings.contactEmail && (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="inline-flex items-center gap-2 text-ld-silver hover:text-ld-gold transition-colors text-sm"
              >
                <Mail className="w-4 h-4 text-ld-gold shrink-0" />
                {settings.contactEmail}
              </a>
            )}
            {settings.contactAddress && (
              <span className="inline-flex items-center gap-2 text-ld-silver text-sm">
                <MapPin className="w-4 h-4 text-ld-gold shrink-0" />
                {settings.contactAddress}
              </span>
            )}
          </div>
          <p className="text-ld-silver text-sm lg:text-right">
            &copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
