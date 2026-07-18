import { getAdminSession } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminShell from "@/components/admin/AdminShell";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    return <AdminLoginForm />;
  }

  return (
    <AdminShell>
      <AdminDashboard />
    </AdminShell>
  );
}
