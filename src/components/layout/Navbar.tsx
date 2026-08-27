"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef, FormEvent } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Package,
  Info,
  ChevronRight,
  HelpCircle,
  Search,
  Truck,
  Phone,
} from "lucide-react";
import SiteLogo from "@/components/ui/SiteLogo";
import { Category, SiteSettings } from "@/types/site";

interface NavLink {
  href: string;
  label: string;
  hash: boolean;
  id?: string;
  icon: typeof Home;
}

/** Labels come from site settings so the admin can rename every link. */
function buildNavLinks(settings: SiteSettings): NavLink[] {
  return [
    { href: "/", label: settings.navHomeLabel, hash: false, icon: Home },
    { href: "/products", label: settings.navCollectionLabel, hash: false, icon: Package },
    { href: "/#about", label: settings.navAboutLabel, hash: true, id: "about", icon: Info },
    { href: "/#faq", label: settings.navFaqLabel, hash: true, id: "faq", icon: HelpCircle },
    {
      href: "/shipping-returns",
      label: settings.navShippingLabel,
      hash: false,
      icon: Truck,
    },
  ];
}

function isActive(pathname: string, link: NavLink) {
  if (link.hash) return false;
  if (link.href === "/") return pathname === "/";
  return pathname.startsWith(link.href.split("#")[0]);
}

function SearchField({
  value,
  onChange,
  onSubmit,
  id,
  placeholder,
  autoFocus = false,
}: {
  value: string;
  onChange: (next: string) => void;
  onSubmit: (e: FormEvent) => void;
  id: string;
  placeholder: string;
  autoFocus?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} role="search" className="relative w-full">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-am-muted" />
      <input
        id={id}
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-am-line bg-am-card py-2.5 pl-10 pr-11 text-sm text-am-ink placeholder:text-am-muted focus:border-am-gold focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-am-gold text-white transition-colors hover:bg-am-gold-deep"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}

export default function Navbar({
  settings,
  categories = [],
}: {
  settings: SiteSettings;
  categories?: Category[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lastSyncedQuery = useRef("");
  const navLinks = buildNavLinks(settings);

  useEffect(() => setMounted(true), []);

  // Keep the field in step with the URL when navigating between result pages.
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== lastSyncedQuery.current) {
      lastSyncedQuery.current = urlQuery;
      setQuery(urlQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const submitSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      lastSyncedQuery.current = trimmed;
      setIsOpen(false);
      setSearchOpen(false);
      router.push(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : "/products");
    },
    [query, router]
  );

  const handleNavClick = useCallback(
    (link: NavLink, e: React.MouseEvent) => {
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
              className="fixed inset-0 z-[100] bg-am-dark/55 md:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              className="fixed bottom-0 right-0 top-0 z-[110] flex w-[min(21rem,88vw)] flex-col border-l border-am-line bg-am-bg shadow-2xl md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="flex h-[4.25rem] items-center justify-between border-b border-am-line bg-am-card px-4">
                <div className="flex min-w-0 items-center gap-2">
                  <SiteLogo size="admin" logoUrl={settings.logoUrl} alt={settings.siteName} />
                  <p className="truncate font-[family-name:var(--font-display)] text-sm font-semibold text-am-ink">
                    {settings.siteNameShort || settings.siteName}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-am-muted transition-colors hover:bg-am-bg-alt hover:text-am-ink"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4">
                <div className="space-y-1.5">
                  {navLinks.map((link) => {
                    const active = isActive(pathname, link);
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={(e) => handleNavClick(link, e)}
                        className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-200 ${
                          active
                            ? "border-am-gold/40 bg-am-gold-tint text-am-gold-deep"
                            : "border-transparent text-am-ink-soft hover:bg-am-bg-alt"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-am-card text-am-gold ${
                            active ? "border-am-gold/40" : "border-am-line"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="min-w-0 flex-1 font-[family-name:var(--font-display)] text-sm font-medium tracking-wide">
                          {link.label}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-am-muted transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    );
                  })}
                </div>

                {categories.length > 0 && (
                  <div className="mt-6">
                    <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-am-muted">
                      {settings.categoriesSectionTitle}
                    </p>
                    <div className="flex flex-wrap gap-2 px-1">
                      {categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/products?category=${encodeURIComponent(category.name)}`}
                          onClick={() => setIsOpen(false)}
                          className="rounded-full border border-am-line bg-am-card px-3 py-1.5 text-xs text-am-ink-soft transition-colors hover:border-am-gold hover:text-am-gold"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {settings.contactPhone && (
                <div className="border-t border-am-line bg-am-card px-4 py-4">
                  <a
                    href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-am-ink transition-colors hover:text-am-gold"
                  >
                    <Phone className="h-4 w-4 text-am-gold" />
                    {settings.contactPhone}
                  </a>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>,
      document.body
    );

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-shadow duration-300 glass-nav ${
          scrolled ? "glass-nav-scrolled" : ""
        }`}
      >
        <nav className="mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-6">
          <div className="flex h-[4.25rem] items-center gap-3 md:h-20 md:gap-6">
            <Link href="/" className="z-50 flex min-w-0 shrink-0 items-center gap-0">
              <SiteLogo size="nav" priority logoUrl={settings.logoUrl} alt={settings.siteName} />
              <span className="-ml-1 hidden truncate font-[family-name:var(--font-display)] text-sm font-bold leading-tight text-am-ink sm:-ml-1.5 sm:text-base md:inline md:text-lg">
                {settings.siteName}
              </span>
            </Link>

            <div className="ml-auto hidden items-center gap-5 md:flex lg:gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(link, e)}
                  className={`group relative text-[13px] font-medium uppercase tracking-wide transition-colors duration-300 lg:text-sm ${
                    isActive(pathname, link)
                      ? "text-am-gold"
                      : "text-am-ink-soft hover:text-am-gold"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-0.5 bg-am-gold transition-all duration-300 ${
                      isActive(pathname, link) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </div>

            <div className="hidden lg:block lg:w-64 xl:w-72">
              <SearchField
                id="desktop-search"
                value={query}
                onChange={setQuery}
                onSubmit={submitSearch}
                placeholder={settings.searchPlaceholder}
              />
            </div>

            <div className="ml-auto flex items-center gap-1.5 md:ml-0 lg:hidden">
              <button
                onClick={() => setSearchOpen((open) => !open)}
                className="rounded-full border border-am-line bg-am-card p-2 text-am-ink transition-colors hover:border-am-gold hover:text-am-gold"
                aria-label={searchOpen ? "Close search" : "Open search"}
                aria-expanded={searchOpen}
              >
                {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setIsOpen((open) => !open)}
                className="rounded-full border border-am-line bg-am-card p-2 text-am-ink transition-colors hover:border-am-gold hover:text-am-gold md:hidden"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {searchOpen && (
              <motion.div
                key="inline-search"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden lg:hidden"
              >
                <div className="pb-3 pt-1">
                  <SearchField
                    id="inline-search"
                    value={query}
                    onChange={setQuery}
                    onSubmit={submitSearch}
                    placeholder={settings.searchPlaceholder}
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
      {mobileMenu}
    </>
  );
}
