import { Suspense } from "react";
import WatchCard from "@/components/watches/WatchCard";
import CategoryFilter from "@/components/watches/CategoryFilter";
import FadeIn from "@/components/ui/FadeIn";
import { getWatches } from "@/lib/data";
import { Watch } from "@/types/watch";

interface WatchesPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function WatchesPage({ searchParams }: WatchesPageProps) {
  const params = await searchParams;
  const category = params.category;
  const search = params.search;

  let watches: Watch[] = [];
  let error = false;

  try {
    watches = await getWatches({ category, search });
  } catch {
    error = true;
    watches = [];
  }

  return (
    <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="section-heading mb-3 sm:mb-4">
              Our <span className="text-gradient-gold">Collection</span>
            </h1>
            <p className="text-ld-silver max-w-xl mx-auto text-sm sm:text-base mb-2">
              Explore our curated selection of premium timepieces
            </p>
            <p className="text-ld-silver/80 text-xs sm:text-sm">
              Filter by category below
            </p>
          </div>
        </FadeIn>

        <Suspense fallback={<div className="h-10" />}>
          <CategoryFilter />
        </Suspense>

        {error ? (
          <div className="text-center py-20">
            <p className="text-ld-silver mb-2">Unable to load watches.</p>
            <p className="text-ld-silver text-sm">
              Please ensure MongoDB is connected and try again.
            </p>
          </div>
        ) : watches.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ld-silver text-lg mb-2">No watches found</p>
            <p className="text-ld-silver text-sm">
              {category ? `No watches in the "${category}" category yet.` : "Check back soon for new arrivals."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {watches.map((watch, index) => (
              <WatchCard key={watch._id} watch={watch} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
