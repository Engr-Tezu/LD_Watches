"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X, Check } from "lucide-react";
import SelectMenu from "@/components/ui/SelectMenu";
import { PRODUCT_SORT_OPTIONS, ProductSort } from "@/lib/product-sort";

interface CollectionToolbarProps {
  categories: string[];
  activeCategory: string;
  activeSort: ProductSort;
  /** Set by the navbar search; shown here only so it can be cleared. */
  activeQuery: string;
  inStockOnly: boolean;
  total: number;
}

export default function CollectionToolbar({
  categories,
  activeCategory,
  activeSort,
  activeQuery,
  inStockOnly,
  total,
}: CollectionToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /** Rewrites the URL, dropping empty values and always resetting to page 1. */
  const push = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    params.delete("page");
    const search = params.toString();
    router.push(search ? `/products?${search}` : "/products");
  };

  const categoryOptions = ["All", ...categories];
  const hasFilters =
    activeCategory !== "All" || Boolean(activeQuery) || inStockOnly || activeSort !== "newest";

  return (
    <div className="rounded-2xl border border-am-line bg-am-card p-3 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Scrolls horizontally rather than pushing the card wider than the screen. */}
        <div className="-mx-3 min-w-0 flex-1 overflow-x-auto px-3 pb-1 scrollbar-hide sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
          <div className="flex gap-2 sm:flex-wrap">
            {categoryOptions.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => push({ category: category === "All" ? null : category })}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    active
                      ? "border-am-gold bg-am-gold font-medium text-white"
                      : "border-am-line text-am-ink-soft hover:border-am-gold hover:text-am-gold"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2 lg:shrink-0">
          <button
            type="button"
            role="switch"
            aria-checked={inStockOnly}
            onClick={() => push({ stock: inStockOnly ? null : "in" })}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors sm:px-4 ${
              inStockOnly
                ? "border-am-gold bg-am-gold-tint font-medium text-am-gold-deep"
                : "border-am-line text-am-ink-soft hover:border-am-line-strong"
            }`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                inStockOnly ? "border-am-gold bg-am-gold text-white" : "border-am-line-strong"
              }`}
            >
              {inStockOnly && <Check className="h-3 w-3" />}
            </span>
            In stock
          </button>

          <SelectMenu
            value={activeSort}
            options={PRODUCT_SORT_OPTIONS}
            onChange={(next) => push({ sort: next === "newest" ? null : next })}
            prefix="Sort:"
            ariaLabel="Sort products"
            className="min-w-0 flex-1 lg:w-52 lg:flex-none"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-am-line pt-3">
        <p className="min-w-0 text-xs text-am-muted sm:text-sm">
          {total === 0 ? "No products" : `${total} ${total === 1 ? "product" : "products"}`}
          {activeQuery && (
            <>
              {" for "}
              <span className="font-medium text-am-ink">&ldquo;{activeQuery}&rdquo;</span>
            </>
          )}
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-am-gold transition-colors hover:text-am-gold-deep sm:text-sm"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
