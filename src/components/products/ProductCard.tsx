"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { ProductLabels } from "@/types/site";
import { formatPrice, getMainImage, cn, isWaterResistant, getProductPricing } from "@/lib/utils";
import WhatsAppButton from "./WhatsAppButton";
import ProductTag from "@/components/ui/ProductTag";
import { Droplets, ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
  labels: ProductLabels;
  index?: number;
  whatsappNumber?: string;
  siteName?: string;
  siteUrl?: string;
}

export default function ProductCard({
  product,
  labels,
  index = 0,
  whatsappNumber,
  siteName,
  siteUrl,
}: ProductCardProps) {
  const imageUrl = getMainImage(product);
  const waterResistant = isWaterResistant(product);
  const pricing = getProductPricing(product);
  const tags = (Array.isArray(product.tags) ? product.tags : [])
    .map((tag) => String(tag || "").trim())
    .filter(Boolean)
    .slice(0, 2);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.35) }}
      className="group card-surface flex h-full flex-col overflow-hidden"
    >
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden bg-am-bg-alt">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
          />

          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {pricing.discount > 0 && (
              <span className="rounded-full bg-[#c0392b] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs">
                -{pricing.discount}%
              </span>
            )}
            {product.featured && (
              <span className="rounded-full bg-am-dark/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-am-gold-bright backdrop-blur-sm sm:text-xs">
                {labels.featured}
              </span>
            )}
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <span className="rounded-full bg-am-dark px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white sm:text-sm">
                {labels.soldOut}
              </span>
            </div>
          )}

          <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-am-card text-am-gold opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
            <ProductTag variant="gold">{product.brand}</ProductTag>
            {tags.map((tag) => (
              <ProductTag key={tag}>{tag}</ProductTag>
            ))}
            {waterResistant && (
              <ProductTag className="gap-1">
                <Droplets className="h-3 w-3 shrink-0 text-am-gold" />
                {labels.waterResistant}
              </ProductTag>
            )}
          </div>

          <h3 className="mb-2 line-clamp-2 font-[family-name:var(--font-display)] text-base font-semibold leading-snug text-am-ink transition-colors group-hover:text-am-gold sm:text-lg">
            {product.name}
          </h3>

          <p className="mb-4 line-clamp-2 flex-1 text-xs leading-relaxed text-am-muted sm:text-sm">
            {product.shortDescription?.trim() || product.description}
          </p>

          <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-am-line pt-3">
            <span className="text-lg font-bold text-am-ink sm:text-xl">
              {formatPrice(pricing.price)}
            </span>
            {pricing.listPrice !== null && (
              <span className="text-sm text-am-muted line-through">
                {formatPrice(pricing.listPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <WhatsAppButton
          product={product}
          variant="card"
          label={labels.orderNow}
          siteName={siteName}
          siteUrl={siteUrl}
          whatsappNumber={whatsappNumber}
          className={cn("w-full", !product.inStock && "pointer-events-none opacity-50")}
        />
      </div>
    </motion.article>
  );
}
