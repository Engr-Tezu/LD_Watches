"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Package, Info, ChevronRight, HelpCircle } from "lucide-react";
import SiteLogo from "@/components/ui/SiteLogo";
import { SiteSettings } from "@/types/site";

const navLinks = [
  { href: "/", label: "Home", hash: false, icon: Home },
  { href: "/products", label: "Collection", hash: false, icon: Package },
  { href: "/#about", label: "About", hash: true, id: "about", icon: Info },
  { href: "/#faq", label: "FAQ", hash: true, id: "faq", icon: HelpCircle },
];

function isActive(pathname: string, link: (typeof navLinks)[0]) {
  if (link.hash) return false;
  if (link.href === "/") return pathname === "/";
  return pathname.startsWith(link.href.split("#")[0]);
}

export default function Navbar({ settings }: { settings: SiteSettings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [pathname]);

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

  const mobileMenu =
    mounted &&
    createPortal(
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] md:hidden"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.72)" }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              className="fixed top-0 right-0 bottom-0 z-[110] flex w-[min(20rem,86vw)] flex-col md:hidden border-l border-[#d4a82e]/30"
              style={{
                backgroundColor: "#0c0c0c",
                boxShadow: "-24px 0 60px rgba(0,0,0,0.75)",
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div
                className="flex h-[4.25rem] items-center justify-between px-5 border-b"
                style={{ borderColor: "rgba(212, 168, 46, 0.2)", backgroundColor: "#111111" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <SiteLogo
                    size="admin"
                    logoUrl={settings.logoUrl}
                    alt={settings.siteName}
                  />
                  <p className="truncate font-[family-name:var(--font-display)] text-sm font-semibold text-white">
                    {settings.siteNameShort || settings.siteName}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-[#a3a3a3] transition-colors hover:text-[#ecc84a]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4" style={{ backgroundColor: "#0c0c0c" }}>
                {navLinks.map((link) => {
                  const active = isActive(pathname, link);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(link, e)}
                      className={`group flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all duration-300 ${
                        active ? "border" : ""
                      }`}
                      style={
                        active
                          ? {
                              backgroundColor: "rgba(212, 168, 46, 0.18)",
                              borderColor: "rgba(212, 168, 46, 0.45)",
                              color: "#ecc84a",
                            }
                          : {
                              backgroundColor: "transparent",
                              borderColor: "transparent",
                              color: "#e5e5e5",
                            }
                      }
                    >
                      <span
                        className="flex h-8 w-8 items-center justify-center shrink-0 rounded-lg border"
                        style={
                          active
                            ? {
                                color: "#ecc84a",
                                borderColor: "rgba(212, 168, 46, 0.45)",
                                backgroundColor: "rgba(212, 168, 46, 0.14)",
                              }
                            : {
                                color: "#d4a82e",
                                borderColor: "rgba(212, 168, 46, 0.25)",
                                backgroundColor: "rgba(212, 168, 46, 0.06)",
                              }
                        }
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1 font-[family-name:var(--font-display)] text-sm font-medium tracking-wide">
                        {link.label}
                      </span>
                      <ChevronRight
                        className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                        style={{ color: active ? "#d4a82e" : "#666" }}
                      />
                    </Link>
                  );
                })}
              </div>

              <div
                className="px-5 py-4 border-t"
                style={{ borderColor: "rgba(212, 168, 46, 0.2)", backgroundColor: "#111111" }}
              >
                <div className="mb-3 h-px w-12 bg-gradient-to-r from-[#d4a82e] to-transparent" />
                <p className="text-xs leading-relaxed text-[#a3a3a3]">
                  Premium products, curated for everyday elegance.
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>,
      document.body
    );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-nav ${
          scrolled || isOpen ? "shadow-lg shadow-black/40" : ""
        }`}
      >
        <nav className="w-full pl-1 pr-3 sm:pl-2 sm:pr-5 lg:px-4">
          <div className="flex h-[4.25rem] items-center md:h-20">
            <Link
              href="/"
              className="group z-50 -my-1 flex min-w-0 shrink-0 items-center gap-0"
            >
              <SiteLogo
                size="nav"
                priority
                logoUrl={settings.logoUrl}
                alt={settings.siteName}
              />
              <span className="-ml-1 hidden truncate font-[family-name:var(--font-display)] text-sm font-bold leading-tight text-white sm:-ml-1.5 sm:text-base md:inline md:max-w-none md:text-lg">
                {settings.siteName}
              </span>
            </Link>

            <div className="ml-auto hidden items-center gap-6 pr-2 md:flex lg:gap-8 lg:pr-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(link, e)}
                  className={`relative text-sm font-medium uppercase tracking-wide transition-colors duration-300 group ${
                    isActive(pathname, link)
                      ? "text-ld-gold-light"
                      : "text-ld-light hover:text-ld-gold-light"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-ld-gold transition-all duration-300 ${
                      isActive(pathname, link) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </div>

            <button
              onClick={() => setIsOpen((open) => !open)}
              className={`z-50 ml-auto rounded-lg p-1.5 transition-colors md:hidden ${
                isOpen
                  ? "text-[#a3a3a3] hover:bg-white/5 hover:text-[#ecc84a]"
                  : "text-[#ecc84a] border border-[#d4a82e]/45 bg-[#d4a82e]/10 backdrop-blur-sm hover:bg-[#d4a82e]/18 hover:border-[#d4a82e]/70"
              }`}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>
      {mobileMenu}
    </>
  );
}
