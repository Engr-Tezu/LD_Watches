import { Suspense } from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import HashScrollHandler from "@/components/layout/HashScrollHandler";
import { getCategories, getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().catch((error) => {
    console.error("[site-layout] Failed to load site settings from MongoDB:", error);
    return DEFAULT_SITE_SETTINGS;
  });
  const categories = await getCategories({ activeOnly: true }).catch((error) => {
    console.error("[site-layout] Failed to load categories from MongoDB:", error);
    return [];
  });

  return (
    <div className="flex min-h-screen flex-col bg-am-bg">
      <HashScrollHandler />
      <AnnouncementBar settings={settings} />
      {/* Navbar reads `?q=` via useSearchParams, so it needs a Suspense boundary. */}
      <Suspense fallback={<div className="h-[4.25rem] border-b border-am-line md:h-20" />}>
        <Navbar settings={settings} categories={categories} />
      </Suspense>
      <main className="flex-1 bg-am-bg">{children}</main>
      <Footer settings={settings} categories={categories} />
      <FloatingWhatsApp
        whatsappNumber={settings.whatsappNumber}
        siteName={settings.siteNameShort || settings.siteName}
      />
    </div>
  );
}
