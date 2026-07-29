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
}

export default function WhatsAppButton({ product, variant = "primary", className = "", whatsappNumber, siteName, siteUrl }: WhatsAppButtonProps) {
  const href = generateWhatsAppLink(product, { whatsappNumber, siteName, siteUrl });
  if (variant === "icon") {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-ld-whatsapp text-white hover:bg-[#1a9549] transition-colors ${className}`} aria-label={`Order ${product.name} on WhatsApp`}><MessageCircle className="w-5 h-5" /></a>;
  }
  if (variant === "card") {
    return <a href={href} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-ld-whatsapp text-white hover:bg-[#1a9549] transition-colors duration-200 ${className}`}><MessageCircle className="w-4 h-4" />Order Now</a>;
  }
  if (variant === "secondary") {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-ld-whatsapp text-ld-whatsapp rounded-lg font-semibold hover:bg-ld-whatsapp hover:text-white transition-colors duration-200 ${className}`}><MessageCircle className="w-5 h-5" />Order Now</a>;
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-ld-whatsapp text-white rounded-lg font-semibold hover:bg-[#1a9549] transition-colors duration-200 ${className}`}><MessageCircle className="w-5 h-5" />Order Now</a>;
}
