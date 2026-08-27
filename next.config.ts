import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Required from Next 16 onward for any `quality` prop we actually use.
    qualities: [75, 90, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        // HTML pages only — keep settings fresh without killing static asset caching.
        source: "/((?!_next/static|_next/image|api|.*\\..*).*)",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/watches",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/watches/:slug",
        destination: "/products/:slug",
        permanent: true,
      },
      {
        source: "/admin/watches",
        destination: "/admin/products",
        permanent: true,
      },
      {
        source: "/admin/watches/:path*",
        destination: "/admin/products/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
