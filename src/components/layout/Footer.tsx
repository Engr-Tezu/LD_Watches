import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import WatchLogo from "@/components/ui/WatchLogo";

export default function Footer() {
  return (
    <footer className="bg-ld-dark border-t border-ld-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="inline-flex mb-4">
              <WatchLogo size="footer" />
            </Link>
            <p className="text-ld-silver text-sm leading-relaxed">
              Curating exceptional timepieces for the discerning collector.
              Premium watches with unmatched craftsmanship and elegance.
            </p>
          </div>

          <div>
            <h3 className="text-ld-gold font-semibold mb-4 uppercase tracking-wider text-sm">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/watches", label: "Collection" },
                { href: "/watches?category=Luxury", label: "Luxury" },
                { href: "/watches?category=Sport", label: "Sport" },
                { href: "/#about", label: "About Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ld-silver hover:text-ld-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-ld-gold font-semibold mb-4 uppercase tracking-wider text-sm">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-ld-silver text-sm">
                <Phone className="w-4 h-4 text-ld-gold" />
                +92 300 1234567
              </li>
              <li className="flex items-center gap-2 text-ld-silver text-sm">
                <Mail className="w-4 h-4 text-ld-gold" />
                info@luxedialwatches.com
              </li>
              <li className="flex items-center gap-2 text-ld-silver text-sm">
                <MapPin className="w-4 h-4 text-ld-gold" />
                Lahore, Pakistan
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-ld-grey/50 text-center">
          <p className="text-ld-silver text-sm">
            &copy; {new Date().getFullYear()} LUXE DIAL WATCHES. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
