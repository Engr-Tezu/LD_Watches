import { getCategories } from "@/lib/site";
import AdminCategoriesManager from "@/components/admin/AdminCategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await getCategories().catch(() => []);
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Categories</h1>
      </div>
      <AdminCategoriesManager initialCategories={categories} />
    </div>
  );
}
