import { getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site";
import AdminSettingsForm from "@/components/admin/AdminSettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
      </div>
      <AdminSettingsForm initialSettings={settings} />
    </div>
  );
}
