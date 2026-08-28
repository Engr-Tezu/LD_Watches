import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { PackageSearch, AlertTriangle } from "lucide-react";
import ProductGrid from "@/components/products/ProductGrid";
import CollectionToolbar from "@/components/products/CollectionToolbar";
import Pagination from "@/components/products/Pagination";
import FadeIn from "@/components/ui/FadeIn";
import { getProducts, countProducts, normalizeSort } from "@/lib/data";
import { getCategories, getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site";
import { getProductLabels } from "@/types/site";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildPageMetadata,
  getSiteUrl,
  truncateAtWord,
} from "@/lib/seo";
import { Product } from "@/types/product";

const PAGE_SIZE = 12;

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
    page?: string;
    stock?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const params = await searchParams;

  const category = params.category?.trim() || "";
  const query = params.q?.trim() || "";
  const rawPage = Number.parseInt(params.page || "1", 10);
  const page = Math.max(1, Number.isFinite(rawPage) ? rawPage : 1);
  const pageSuffix = page > 1 ? ` – Page ${page}` : "";

  // Free-text search produces near-infinite URL permutations with thin,
  // duplicated content: crawlable so products are still discovered, but not
  // indexed. Category pages are real facets and stay indexable.
  if (query) {
    return buildPageMetadata({
      title: `Search results for “${query}”${pageSuffix}`,
      description: `Products matching “${query}” at ${settings.siteName}.`,
      path: "/products",
      settings,
      noIndex: true,
    });
  }

  if (category) {
    return buildPageMetadata({
      title: `${category}${pageSuffix}`,
      description: truncateAtWord(
        `Browse our ${category} collection at ${settings.siteName}. ${settings.collectionPageSubtitle}`
      ),
      // Canonical keeps the facet but drops sort/stock refinements.
      path: `/products?category=${encodeURIComponent(category)}${
        page > 1 ? `&page=${page}` : ""
      }`,
      settings,
    });
  }

  return buildPageMetadata({
    title: `${settings.collectionPageTitle}${pageSuffix}`,
    description: truncateAtWord(
      settings.collectionPageSubtitle || settings.seoDescription
    ),
    path: page > 1 ? `/products?page=${page}` : "/products",
    settings,
  });
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const categories = await getCategories({ activeOnly: true }).catch(() => []);

  const category = params.category?.trim() || "All";
  const query = params.q?.trim() || "";
  const sort = normalizeSort(params.sort);
  const inStockOnly = params.stock === "in";
  const requestedPage = Number.parseInt(params.page || "1", 10);
  const filters = {
    category: category === "All" ? undefined : category,
    search: query || undefined,
    inStockOnly,
  };

  let items: Product[] = [];
  let total = 0;
  let error = false;

  try {
    total = await countProducts(filters);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(
      Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1),
      totalPages
    );
    items = await getProducts({
      ...filters,
      sort,
      limit: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    });
  } catch {
    error = true;
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(
    Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1),
    totalPages
  );

  // A product can carry a category that is no longer in the managed list; keep
  // its pill visible so the active filter is always reflected in the UI.
  const categoryNames = categories.map((item) => item.name);
  const filterCategories =
    category !== "All" && !categoryNames.includes(category)
      ? [...categoryNames, category]
      : categoryNames;

  // Everything except `page`, so pagination links keep the active filters.
  const baseQuery = new URLSearchParams(
    Object.entries({
      category: category === "All" ? "" : category,
      q: query,
      sort: sort === "newest" ? "" : sort,
      stock: inStockOnly ? "in" : "",
    }).filter(([, value]) => Boolean(value)) as [string, string][]
  ).toString();

  const siteUrl = getSiteUrl(settings);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    [
      { name: settings.navHomeLabel, path: "/" },
      { name: settings.collectionPageTitle, path: "/products" },
      ...(category !== "All"
        ? [
            {
              name: category,
              path: `/products?category=${encodeURIComponent(category)}`,
            },
          ]
        : []),
    ],
    siteUrl
  );

  // Tells search engines what this listing contains and in what order.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category !== "All" ? category : settings.collectionPageTitle,
    numberOfItems: total,
    itemListElement: items.map((product, index) => ({
      "@type": "ListItem",
      position: (currentPage - 1) * PAGE_SIZE + index + 1,
      url: absoluteUrl(`/products/${product.slug}`, siteUrl),
      name: product.name,
    })),
  };

  return (
    <div className="pb-14 sm:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {items.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}

      <div className="border-b border-am-line bg-am-bg-alt">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 sm:py-11 lg:px-8">
          <FadeIn>
            {/* The H1 mirrors the <title> so the page has one clear subject. */}
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-am-ink sm:text-3xl md:text-4xl">
              {query
                ? `Search results for “${query}”`
                : category !== "All"
                  ? category
                  : settings.collectionPageTitle}
            </h1>
            {!query && settings.collectionPageSubtitle && (
              <p className="mx-auto mt-3 max-w-xl text-sm text-am-ink-soft sm:text-base">
                {category !== "All"
                  ? `Browse our ${category} collection.`
                  : settings.collectionPageSubtitle}
              </p>
            )}
            <div className="rule-gold mx-auto mt-4 h-px w-16" aria-hidden />
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="h-40" />}>
          <CollectionToolbar
            categories={filterCategories}
            activeCategory={category}
            activeSort={sort}
            activeQuery={query}
            inStockOnly={inStockOnly}
            total={total}
          />
        </Suspense>

        <div className="mt-8">
          {error ? (
            <div className="rounded-2xl border border-am-line bg-am-card px-6 py-16 text-center">
              <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-am-gold" />
              <p className="mb-1 font-semibold text-am-ink">Unable to load products</p>
              <p className="text-sm text-am-muted">
                The product database is unreachable right now. Please try again shortly.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-am-line bg-am-card px-6 py-16 text-center">
              <PackageSearch className="mx-auto mb-4 h-10 w-10 text-am-line-strong" />
              <p className="mb-1 text-lg font-semibold text-am-ink">{settings.emptyResultsTitle}</p>
              <p className="text-sm text-am-muted">
                {query
                  ? `Nothing matched “${query}”. Try a different search term.`
                  : category !== "All"
                    ? `No products in “${category}” yet.`
                    : settings.emptyResultsMessage}
              </p>
              <Link
                href="/products"
                className="btn-outline-gold mt-6 px-6 py-2.5 text-sm"
              >
                {settings.viewAllLabel}
              </Link>
            </div>
          ) : (
            <>
              <ProductGrid
                products={items}
                labels={getProductLabels(settings)}
                whatsappNumber={settings.whatsappNumber}
                siteName={settings.siteName}
                siteUrl={settings.siteUrl}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseQuery={baseQuery}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
