"use client";

import { MessageCircle } from "lucide-react";
import { Product } from "@/types/product";
import { generateWhatsAppLink } from "@/lib/utils";

interface WhatsAppButtonProps {
  product: Product;
  variant?: "primary" | "card" | "secondary" | "icon";
  className?: string;
  whatsappNumber?: string;
  siteName?: string;
  siteUrl?: string;
  /** Visible button text; comes from site settings so the admin controls it. */
  label?: string;
}

const BASE =
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200";

export default function WhatsAppButton({
  product,
  variant = "primary",
  className = "",
  whatsappNumber,
  siteName,
  siteUrl,
  label,
}: WhatsAppButtonProps) {
  const href = generateWhatsAppLink(product, { whatsappNumber, siteName, siteUrl });
  const accessibleName = `Order ${product.name} on WhatsApp`;

  if (variant === "icon") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${BASE} h-10 w-10 rounded-full bg-am-whatsapp text-white hover:bg-[#0f7f3d] ${className}`}
        aria-label={accessibleName}
      >
        <MessageCircle className="h-5 w-5" />
      </a>
    );
  }

  if (variant === "card") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        aria-label={accessibleName}
        className={`${BASE} rounded-full bg-am-whatsapp px-4 py-2.5 text-sm text-white hover:bg-[#0f7f3d] ${className}`}
      >
        <MessageCircle className="h-4 w-4" />
        {label || "Order Now"}
      </a>
    );
  }

  if (variant === "secondary") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={accessibleName}
        className={`${BASE} rounded-full border-2 border-am-whatsapp px-6 py-3 text-am-whatsapp hover:bg-am-whatsapp hover:text-white ${className}`}
      >
        <MessageCircle className="h-5 w-5" />
        {label || "Order Now"}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={accessibleName}
      className={`${BASE} rounded-full bg-am-whatsapp px-8 py-3.5 text-white hover:bg-[#0f7f3d] ${className}`}
    >
      <MessageCircle className="h-5 w-5" />
      {label || "Order on WhatsApp"}
    </a>
  );
}
