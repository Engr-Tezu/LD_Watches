import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
