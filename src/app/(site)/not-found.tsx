import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center px-4">
        <h1 className="font-[family-name:var(--font-display)] text-6xl font-bold text-gradient-gold mb-4">
          404
        </h1>
        <h2 className="text-2xl text-white mb-4">Page Not Found</h2>
        <p className="text-ld-silver mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-flex px-6 py-3 bg-ld-gold text-ld-black font-semibold rounded-lg hover:bg-ld-gold-light transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
