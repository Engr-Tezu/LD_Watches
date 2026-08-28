"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, PackageSearch, RotateCw } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { Product } from "@/types/product";
import { ProductLabels } from "@/types/site";

interface AllProductsSectionProps {
  title: React.ReactNode;
  subtitle?: string;
  categories: string[];
  labels: ProductLabels;
  whatsappNumber?: string;
  siteName?: string;
  siteUrl?: string;
}

/** Items fetched per scroll step, by viewport. */
function pageSizeForViewport(): number {
  if (typeof window === "undefined") return 12;
  if (window.matchMedia("(min-width: 1024px)").matches) return 12; // desktop
  if (window.matchMedia("(min-width: 640px)").matches) return 8; // tablet
  return 6; // mobile
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-am-line bg-am-card">
      <div className="aspect-square animate-pulse bg-am-bg-alt" />
      <div className="space-y-3 p-4 sm:p-5">
        <div className="h-3 w-20 animate-pulse rounded-full bg-am-bg-alt" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-am-bg-alt" />
        <div className="h-3 w-full animate-pulse rounded bg-am-bg-alt" />
        <div className="h-6 w-24 animate-pulse rounded bg-am-bg-alt" />
      </div>
    </div>
  );
}

export default function AllProductsSection({
  title,
  subtitle,
  categories,
  labels,
  whatsappNumber,
  siteName,
  siteUrl,
}: AllProductsSectionProps) {
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageSizeRef = useRef(12);
  // Guards against overlapping fetches and against a stale response from a
  // previous category landing in the list after the user switched.
  const inFlightRef = useRef(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    pageSizeRef.current = pageSizeForViewport();
  }, []);

  const loadPage = useCallback(
    async (nextPage: number, activeCategory: string) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      requestIdRef.current += 1;
      const requestId = requestIdRef.current;

      setLoading(true);
      setFailed(false);

      try {
        const params = new URLSearchParams({
          page: String(nextPage),
          limit: String(pageSizeRef.current),
          sort: "newest",
        });
        if (activeCategory !== "All") params.set("category", activeCategory);

        const res = await fetch(`/api/products?${params.toString()}`);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Request failed");

        // A newer request (category switch) superseded this one — drop it.
        if (requestId !== requestIdRef.current) return;

        const batch: Product[] = Array.isArray(json.data) ? json.data : [];
        setItems((prev) => {
          if (nextPage === 1) return batch;
          // De-dupe defensively; a product added between pages can shift offsets.
          const seen = new Set(prev.map((item) => item._id));
          return [...prev, ...batch.filter((item) => !seen.has(item._id))];
        });
        setPage(nextPage);
        setHasMore(Boolean(json.hasMore));
      } catch {
        if (requestId === requestIdRef.current) setFailed(true);
      } finally {
        // Only the newest request clears the flags; a superseded one must not
        // reopen the gate while its replacement is still running.
        if (requestId === requestIdRef.current) {
          setLoading(false);
          inFlightRef.current = false;
        }
      }
    },
    []
  );

  // First page, and a full reset whenever the category changes.
  useEffect(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
    inFlightRef.current = false;
    loadPage(1, category);
  }, [category, loadPage]);

  // Load the next page as the sentinel scrolls into view.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading || failed || page === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadPage(page + 1, category);
      },
      // Start fetching a little before the sentinel is actually visible.
      { rootMargin: "400px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, failed, page, category, loadPage]);

  const filterOptions = ["All", ...categories];
  const showInitialSkeletons = loading && items.length === 0;

  return (
    <section id="all-products" className="bg-am-bg py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} />

        {filterOptions.length > 1 && (
          <div className="-mx-4 mt-6 overflow-x-auto px-4 pb-1 scrollbar-hide sm:mx-0 sm:overflow-visible sm:px-0">
            <div className="flex gap-2 sm:flex-wrap">
              {filterOptions.map((name) => {
                const active = category === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setCategory(name)}
                    aria-pressed={active}
                    className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      active
                        ? "border-am-gold bg-am-gold font-medium text-white"
                        : "border-am-line text-am-ink-soft hover:border-am-gold hover:text-am-gold"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8">
          {showInitialSkeletons ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {Array.from({ length: pageSizeRef.current }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : items.length === 0 && !loading ? (
            <div className="rounded-2xl border border-am-line bg-am-card px-6 py-16 text-center">
              <PackageSearch className="mx-auto mb-4 h-10 w-10 text-am-line-strong" />
              <p className="text-sm text-am-muted">
                {failed
                  ? "Could not load products. Please try again."
                  : category === "All"
                    ? "No products yet."
                    : `No products in “${category}” yet.`}
              </p>
              {failed && (
                <button
                  type="button"
                  onClick={() => loadPage(1, category)}
                  className="btn-outline-gold mt-5 px-5 py-2.5 text-sm"
                >
                  <RotateCw className="h-4 w-4" />
                  Retry
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                {items.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    labels={labels}
                    // Stagger only within the newest batch so later pages
                    // don't inherit an ever-growing delay.
                    index={index % pageSizeRef.current}
                    whatsappNumber={whatsappNumber}
                    siteName={siteName}
                    siteUrl={siteUrl}
                  />
                ))}
              </div>

              {/* Sentinel — entering the viewport requests the next page. */}
              <div ref={sentinelRef} aria-hidden className="h-px w-full" />

              <div className="mt-8 flex justify-center">
                {loading && (
                  <span className="inline-flex items-center gap-2 text-sm text-am-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading more…
                  </span>
                )}

                {!loading && failed && (
                  <button
                    type="button"
                    onClick={() => loadPage(page + 1, category)}
                    className="btn-outline-gold px-6 py-2.5 text-sm"
                  >
                    <RotateCw className="h-4 w-4" />
                    Retry
                  </button>
                )}

                {!loading && !failed && !hasMore && items.length > 0 && (
                  <span className="text-sm text-am-muted">
                    You have seen all {items.length}{" "}
                    {items.length === 1 ? "product" : "products"}.
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
