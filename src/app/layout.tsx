import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { LOGO_PATH, SITE_NAME } from "@/lib/brand";
import "./globals.css";
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

//comment

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} | Premium Luxury Timepieces`,
  description:
    `Discover curated luxury watches at ${SITE_NAME}. Premium timepieces with unmatched craftsmanship. Order via WhatsApp.`,
  keywords: ["watches", "luxury watches", SITE_NAME, "Luxe Dial", "timepieces", "Pakistan"],
  icons: {
    icon: LOGO_PATH,
    apple: LOGO_PATH,
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
