import Link from "next/link";
import { SITE_NAME } from "@/lib/brand";
import { getWatches, getWatchCount } from "@/lib/data";
import { Watch } from "@/types/watch";
import { Watch as WatchIcon, Star, Package } from "lucide-react";

export default async function AdminDashboard() {
  let watchCount = 0;
  let featuredCount = 0;
  let inStockCount = 0;
  let recentWatches: Watch[] = [];

  try {
    watchCount = await getWatchCount();
    const watches = await getWatches();
    featuredCount = watches.filter((w) => w.featured).length;
    inStockCount = watches.filter((w) => w.inStock).length;
    recentWatches = watches.slice(0, 5);
  } catch {
    // MongoDB not connected
  }

  const stats = [
    { label: "Total Watches", value: watchCount, icon: WatchIcon, color: "text-ld-gold" },
    { label: "Featured", value: featuredCount, icon: Star, color: "text-yellow-400" },
    { label: "In Stock", value: inStockCount, icon: Package, color: "text-green-400" },
  ];

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-ld-silver text-sm mt-1">Welcome to {SITE_NAME} admin panel</p>
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
        <h2 className="text-white font-semibold mb-4">Recent Watches</h2>
        {recentWatches.length === 0 ? (
          <p className="text-ld-silver text-sm">No watches added yet.</p>
        ) : (
          <div className="space-y-3">
            {recentWatches.map((watch) => (
              <div
                key={watch._id}
                className="flex items-center justify-between p-3 bg-ld-dark rounded-lg"
              >
                <div>
                  <p className="text-white text-sm font-medium">{watch.name}</p>
                  <p className="text-ld-silver text-xs">
                    {watch.brand} · {watch.category}
                  </p>
                </div>
                <Link
                  href={`/admin/watches/${watch._id}/edit`}
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
