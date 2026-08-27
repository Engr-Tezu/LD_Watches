import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Query string of the active filters, without `page` (may be empty). */
  baseQuery: string;
}

function hrefFor(page: number, baseQuery: string) {
  const params = new URLSearchParams(baseQuery);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/products?${search}` : "/products";
}

/** Compact page list: first, last, and a window around the current page. */
function pageList(current: number, total: number): Array<number | "gap"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current]);
  if (current - 1 > 1) pages.add(current - 1);
  if (current + 1 < total) pages.add(current + 1);

  const sorted = [...pages].sort((a, b) => a - b);
  const out: Array<number | "gap"> = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) out.push("gap");
    out.push(page);
  });
  return out;
}

export default function Pagination({ currentPage, totalPages, baseQuery }: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = pageList(currentPage, totalPages);
  const linkBase =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors";

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link
          href={hrefFor(currentPage - 1, baseQuery)}
          className={`${linkBase} border-am-line bg-am-card text-am-ink hover:border-am-gold hover:text-am-gold`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className={`${linkBase} border-am-line bg-am-bg-alt text-am-muted opacity-60`}
          aria-disabled
        >
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {items.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1.5 text-sm text-am-muted">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item, baseQuery)}
            aria-current={item === currentPage ? "page" : undefined}
            className={`${linkBase} ${
              item === currentPage
                ? "border-am-gold bg-am-gold text-white"
                : "border-am-line bg-am-card text-am-ink hover:border-am-gold hover:text-am-gold"
            }`}
          >
            {item}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={hrefFor(currentPage + 1, baseQuery)}
          className={`${linkBase} border-am-line bg-am-card text-am-ink hover:border-am-gold hover:text-am-gold`}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className={`${linkBase} border-am-line bg-am-bg-alt text-am-muted opacity-60`}
          aria-disabled
        >
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
