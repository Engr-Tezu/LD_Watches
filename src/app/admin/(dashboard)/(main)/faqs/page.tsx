import { getSiteSettings } from "@/lib/site";
import AdminFaqsManager from "@/components/admin/AdminFaqsManager";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site";

export default async function AdminFaqsPage() {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">FAQs</h1>
        <p className="text-ld-silver text-sm mt-1">
          Manage FAQ questions and answers shown on the homepage.
        </p>
      </div>
      <AdminFaqsManager initialSettings={settings} />
    </div>
  );
}

