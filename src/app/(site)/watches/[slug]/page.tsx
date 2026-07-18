import { SITE_NAME } from "@/lib/brand";
import { notFound } from "next/navigation";
import Link from "next/link";
import WatchDetailView from "@/components/watches/WatchDetailView";
import WatchCard from "@/components/watches/WatchCard";
import FadeIn from "@/components/ui/FadeIn";
import { getWatchBySlug, getWatches } from "@/lib/data";
import { Watch } from "@/types/watch";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface WatchDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: WatchDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const watch = await getWatchBySlug(slug);

  if (!watch) {
    return { title: `Watch Not Found | ${SITE_NAME}` };
  }

  return {
    title: `${watch.name} | ${SITE_NAME}`,
    description: watch.description.slice(0, 160),
  };
}

export default async function WatchDetailPage({ params }: WatchDetailPageProps) {
  const { slug } = await params;
  const watch = await getWatchBySlug(slug);

  if (!watch) {
    notFound();
  }

  let categoryWatches: Watch[] = [];
  try {
    const allInCategory = await getWatches({ category: watch.category });
    categoryWatches = allInCategory.filter((w) => w._id !== watch._id);
  } catch {
    categoryWatches = [];
  }

  return (
    <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/watches"
          className="inline-flex items-center gap-2 text-ld-silver hover:text-ld-gold-light transition-colors mb-6 sm:mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Link>

        <WatchDetailView watch={watch} />

        {categoryWatches.length > 0 && (
          <section className="mt-16 sm:mt-24 pt-10 sm:pt-14 border-t border-ld-grey/30">
            <FadeIn>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8 sm:mb-10">
                <div>
                  <p className="text-ld-gold-light text-xs uppercase tracking-widest font-medium mb-2">
                    Same Category
                  </p>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    More <span className="text-gradient-gold">{watch.category}</span> Watches
                  </h2>
                </div>
                <Link
                  href={`/watches?category=${watch.category}`}
                  className="text-ld-silver hover:text-ld-gold-light text-sm transition-colors"
                >
                  View all {watch.category} →
                </Link>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {categoryWatches.slice(0, 8).map((item, index) => (
                <WatchCard key={item._id} watch={item} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
