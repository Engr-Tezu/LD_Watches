import { Watch } from "@/types/watch";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getMainImage(watch: Watch): string {
  const images = watch.images?.length ? watch.images : ["/placeholder-watch.svg"];
  const index = watch.mainImageIndex ?? 0;
  return images[Math.min(index, images.length - 1)] ?? images[0];
}

export function getOrderedImages(watch: Watch): string[] {
  const images = watch.images?.length ? watch.images : ["/placeholder-watch.svg"];
  const index = Math.min(watch.mainImageIndex ?? 0, images.length - 1);
  if (index <= 0) return images;
  return [images[index], ...images.filter((_, i) => i !== index)];
}

export function isWaterResistant(watch: Watch): boolean {
  if (typeof watch.waterResistant === "boolean") return watch.waterResistant;
  return Boolean(watch.specifications?.waterResistance);
}

export function generateWhatsAppLink(watch: Watch): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");

  const message = [
    "Hello LUXE DIAL WATCHES! 👋",
    "",
    "I'm interested in this watch:",
    "",
    `⌚ *${watch.name}*`,
    `🏷️ Brand: ${watch.brand}`,
    `📂 Category: ${watch.category}`,
    `💰 Price: ${formatPrice(watch.price)}`,
    isWaterResistant(watch) ? "💧 Water Resistant: Yes" : "",
    "",
    watch.description.slice(0, 150),
    "",
    `🔗 View: ${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/watches/${watch.slug}`,
    "",
    "Please share availability and delivery details. Thank you!",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getDiscountPercentage(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
