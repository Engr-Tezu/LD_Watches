import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const title = settings.seoTitle?.trim() || settings.siteName;
  const description =
    settings.seoDescription?.trim() || DEFAULT_SITE_SETTINGS.seoDescription;
  const siteUrl = (settings.siteUrl || "http://localhost:3000").replace(/\/$/, "");
  const ogImage = settings.seoOgImage || settings.logoUrl;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${settings.siteName}`,
    },
    description,
    keywords: settings.seoKeywords?.length ? settings.seoKeywords : undefined,
    icons: {
      icon: settings.logoUrl,
      apple: settings.logoUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: settings.siteName,
      title,
      description,
      images: ogImage
        ? [
            {
              url: ogImage,
              alt: settings.siteName,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: siteUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
