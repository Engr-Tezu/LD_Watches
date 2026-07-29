import { Product } from "@/types/product";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getMainImage(product: Product): string {
  const images = product.images?.length ? product.images : ["/placeholder-watch.svg"];
  const index = product.mainImageIndex ?? 0;
  return images[Math.min(index, images.length - 1)] ?? images[0];
}

export function getOrderedImages(product: Product): string[] {
  const images = product.images?.length ? product.images : ["/placeholder-watch.svg"];
  const index = Math.min(product.mainImageIndex ?? 0, images.length - 1);
  if (index <= 0) return images;
  return [images[index], ...images.filter((_, i) => i !== index)];
}

export function isWaterResistant(product: Product): boolean {
  if (typeof product.waterResistant === "boolean") return product.waterResistant;
  return Boolean(product.specifications?.waterResistance);
}

export function generateWhatsAppLink(product: Product, options?: { whatsappNumber?: string; siteName?: string; siteUrl?: string }): string {
  const phoneNumber = options?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  const siteName = options?.siteName || "Our Store";
  const siteUrl = options?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const message = [
    `Hello ${siteName}!`,
    "",
    "I'm interested in this item:",
    "",
    `*${product.name}*`,
    `Brand: ${product.brand}`,
    `Category: ${product.category}`,
    `Price: ${formatPrice(product.price)}`,
    isWaterResistant(product) ? "Water Resistant: Yes" : "",
    "",
    product.description.slice(0, 150),
    "",
    `View: ${siteUrl}/products/${product.slug}`,
    "",
    "Please share availability and delivery details. Thank you!",
  ].filter(Boolean).join("\n");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getDiscountPercentage(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
