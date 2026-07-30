import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
    <div className="min-h-screen flex flex-col bg-ld-black">
      <HashScrollHandler />
      <Navbar settings={settings} />
      <main className="flex-1 bg-ld-black">{children}</main>
      <Footer settings={settings} categories={categories} />
    </div>
  );
}
