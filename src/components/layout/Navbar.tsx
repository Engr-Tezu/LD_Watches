"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import WatchLogo from "@/components/ui/WatchLogo";

const navLinks = [
  { href: "/", label: "Home", hash: false },
  { href: "/watches", label: "Collection", hash: false },
  { href: "/#about", label: "About", hash: true, id: "about" },
  { href: "/#contact", label: "Contact", hash: true, id: "contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = useCallback(
    (link: (typeof navLinks)[0], e: React.MouseEvent) => {
      if (link.hash && link.id) {
        e.preventDefault();
        setIsOpen(false);

        if (pathname === "/") {
          document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
        } else {
          router.push(`/#${link.id}`);
        }
      } else {
        setIsOpen(false);
      }
    },
    [pathname, router]
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-nav ${
        scrolled || isOpen ? "bg-opacity-90" : ""
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[4.25rem] md:h-20">
          <Link href="/" className="flex items-center group z-50 shrink-0 -my-1">
            <WatchLogo size="nav" priority />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(link, e)}
                className={`text-sm tracking-wide uppercase font-medium relative group transition-colors duration-300 ${
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]) && !link.hash)
                    ? "text-ld-gold-light"
                    : "text-ld-light hover:text-ld-gold-light"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-ld-gold transition-all duration-300 ${
                    pathname === link.href ||
                    (link.href === "/watches" && pathname.startsWith("/watches"))
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-ld-light hover:text-ld-gold transition-colors z-50"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[4.25rem] md:top-20 bg-black/60 md:hidden z-40"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute left-0 right-0 top-full glass-nav border-t border-ld-gold/10 z-40"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(link, e)}
                    className={`block py-3 px-3 rounded-lg transition-colors uppercase text-sm tracking-wide ${
                      pathname === link.href ||
                      (link.href === "/watches" && pathname.startsWith("/watches"))
                        ? "text-ld-gold bg-ld-gold/10"
                        : "text-ld-light hover:text-ld-gold hover:bg-ld-charcoal"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
