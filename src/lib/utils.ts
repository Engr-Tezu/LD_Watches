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

export interface ProductPricing {
  /** What the customer actually pays. */
  price: number;
  /** Struck-through "was" price, or null when there is no discount. */
  listPrice: number | null;
  /** Whole-number percent off, 0 when there is no discount. */
  discount: number;
  /** Absolute amount saved, 0 when there is no discount. */
  saving: number;
}

/**
 * Single source of truth for what a product costs on the storefront.
 *
 * `discountPercentage` is the primary control: the stored `price` is the
 * regular price and the sale price is derived from it. `originalPrice` is the
 * older way of expressing the same thing and is still honoured for products
 * that were set up before the percentage field existed.
 */
export function getProductPricing(product: Product): ProductPricing {
  const regular = Math.max(0, Number(product.price) || 0);
  const percent = Math.min(95, Math.max(0, Number(product.discountPercentage) || 0));

  if (percent > 0) {
    const sale = Math.round(regular * (1 - percent / 100));
    return {
      price: sale,
      listPrice: regular,
      discount: Math.round(percent),
      saving: regular - sale,
    };
  }

  const original = Number(product.originalPrice) || 0;
  if (original > regular) {
    return {
      price: regular,
      listPrice: original,
      discount: Math.round(((original - regular) / original) * 100),
      saving: original - regular,
    };
  }

  return { price: regular, listPrice: null, discount: 0, saving: 0 };
}

export function generateWhatsAppLink(product: Product, options?: { whatsappNumber?: string; siteName?: string; siteUrl?: string }): string {
  const phoneNumber = options?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  const siteName = options?.siteName || "Our Store";
  const siteUrl = options?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const pricing = getProductPricing(product);
  const message = [
    `Hello ${siteName}!`,
    "",
    "I'm interested in this item:",
    "",
    `*${product.name}*`,
    `Brand: ${product.brand}`,
    `Category: ${product.category}`,
    `Price: ${formatPrice(pricing.price)}`,
    pricing.listPrice
      ? `Was: ${formatPrice(pricing.listPrice)} (${pricing.discount}% off)`
      : "",
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

