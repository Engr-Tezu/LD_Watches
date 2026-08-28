import Link from "next/link";
import { Home, Search } from "lucide-react";

// Next.js ignores `metadata` exports in not-found.tsx and emits its own
// `noindex` for this route, so there is nothing to declare here.
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-20">
      <div className="text-center">
        <p className="font-[family-name:var(--font-display)] text-6xl font-bold text-gradient-gold sm:text-7xl">
          404
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-am-ink sm:text-3xl">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-am-ink-soft sm:text-base">
          The page you are looking for doesn&apos;t exist or may have moved.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link href="/" className="btn-gold px-6 py-3 text-sm">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <Link href="/products" className="btn-outline-gold px-6 py-3 text-sm">
            <Search className="h-4 w-4" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
