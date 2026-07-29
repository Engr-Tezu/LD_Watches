import Link from "next/link";
import { getProducts, getProductCount } from "@/lib/data";
import { getCategories } from "@/lib/site";
import { Product } from "@/types/product";
import { Package, Star, FolderTree } from "lucide-react";

export default async function AdminDashboard() {
  let itemCount = 0;
  let featuredCount = 0;
  let categoryCount = 0;
  let recentItems: Product[] = [];

  try {
    itemCount = await getProductCount();
    const items = await getProducts();
    const categories = await getCategories();
    categoryCount = categories.length;
    featuredCount = items.filter((w) => w.featured).length;
    recentItems = items.slice(0, 5);
  } catch {
    // MongoDB not connected
  }

  const stats = [
    { label: "Total Products", value: itemCount, icon: Package, color: "text-ld-gold" },
    { label: "Featured", value: featuredCount, icon: Star, color: "text-yellow-400" },
    { label: "Categories", value: categoryCount, icon: FolderTree, color: "text-blue-400" },
  ];

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 bg-ld-charcoal rounded-xl border border-ld-grey/50"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-ld-silver text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-ld-charcoal rounded-xl border border-ld-grey/50 p-6">
        <h2 className="text-white font-semibold mb-4">Recent Products</h2>
        {recentItems.length === 0 ? (
          <p className="text-ld-silver text-sm">No products yet.</p>
        ) : (
          <div className="space-y-3">
            {recentItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 bg-ld-dark rounded-lg"
              >
                <div>
                  <p className="text-white text-sm font-medium">{item.name}</p>
                  <p className="text-ld-silver text-xs">
                    {item.brand} · {item.category}
                  </p>
                </div>
                <Link
                  href={`/admin/products/${item._id}/edit`}
                  className="text-ld-gold text-xs hover:text-ld-gold-light transition-colors"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
