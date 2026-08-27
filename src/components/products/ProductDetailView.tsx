"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { ProductLabels } from "@/types/site";
import { formatPrice, getOrderedImages, isWaterResistant, getProductPricing } from "@/lib/utils";
import WhatsAppButton from "./WhatsAppButton";
import ProductTag from "@/components/ui/ProductTag";
import { Check, Droplets, ChevronRight, ChevronLeft, Home } from "lucide-react";

interface ProductDetailProps {
  product: Product;
  labels: ProductLabels;
  /** Breadcrumb text, from site settings. */
  homeLabel: string;
  collectionLabel: string;
  whatsappNumber?: string;
  siteName?: string;
  siteUrl?: string;
}

export default function ProductDetailView({
  product,
  labels,
  homeLabel,
  collectionLabel,
  whatsappNumber,
  siteName,
  siteUrl,
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const images = getOrderedImages(product);
  const waterResistant = isWaterResistant(product);
  const pricing = getProductPricing(product);
  const features = Array.isArray(product.features)
    ? product.features
        .map((feature) => (typeof feature === "string" ? feature.trim() : ""))
        .filter(Boolean)
    : [];

  const showImage = (next: number) =>
    setSelectedImage(((next % images.length) + images.length) % images.length);

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-am-muted sm:text-sm">
          <li>
            <Link href="/" className="inline-flex items-center gap-1 hover:text-am-gold">
              <Home className="h-3.5 w-3.5" />
              {homeLabel}
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <li>
            <Link href="/products" className="hover:text-am-gold">
              {collectionLabel}
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <li>
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="hover:text-am-gold"
            >
              {product.category}
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <li className="truncate font-medium text-am-ink" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14 xl:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl border border-am-line bg-am-card sm:mb-4">
            <Image
              src={images[selectedImage]}
              alt={`${product.name} — image ${selectedImage + 1} of ${images.length}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
              {pricing.discount > 0 && (
                <span className="rounded-full bg-[#c0392b] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  -{pricing.discount}% off
                </span>
              )}
              {product.featured && (
                <span className="rounded-full bg-am-dark/85 px-3 py-1 text-xs font-bold uppercase tracking-wider text-am-gold-bright backdrop-blur-sm">
                  {labels.featured}
                </span>
              )}
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => showImage(selectedImage - 1)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-am-line bg-am-card/90 text-am-ink transition-colors hover:border-am-gold hover:text-am-gold"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => showImage(selectedImage + 1)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-am-line bg-am-card/90 text-am-ink transition-colors hover:border-am-gold hover:text-am-gold"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:gap-3">
              {images.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={selectedImage === index}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-20 sm:w-20 ${
                    selectedImage === index
                      ? "border-am-gold"
                      : "border-am-line opacity-75 hover:border-am-gold/50 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <ProductTag variant="gold">{product.brand}</ProductTag>
            <ProductTag>{product.category}</ProductTag>
            {(Array.isArray(product.tags) ? product.tags : [])
              .map((tag) => String(tag || "").trim())
              .filter(Boolean)
              .map((tag) => (
                <ProductTag key={tag}>{tag}</ProductTag>
              ))}
            {waterResistant && (
              <ProductTag className="gap-1">
                <Droplets className="h-3 w-3 text-am-gold" />
                {labels.waterResistant}
              </ProductTag>
            )}
          </div>

          <h1 className="mb-4 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight text-am-ink sm:text-3xl md:text-4xl lg:text-[2.75rem]">
            {product.name}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-am-line pb-6">
            <span className="text-2xl font-bold text-am-ink sm:text-3xl">
              {formatPrice(pricing.price)}
            </span>
            {pricing.listPrice !== null && (
              <>
                <span className="text-lg text-am-muted line-through">
                  {formatPrice(pricing.listPrice)}
                </span>
                <span className="rounded-full bg-[#fdecea] px-3 py-1 text-xs font-semibold text-[#c0392b]">
                  -{pricing.discount}%
                </span>
              </>
            )}
            {product.inStock ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#bfe3cd] bg-[#eaf7ef] px-3 py-1 text-xs font-medium text-[#177245] sm:text-sm">
                <Check className="h-3.5 w-3.5" />
                {labels.inStock}
              </span>
            ) : (
              <span className="rounded-full border border-[#f2c6c1] bg-[#fdecea] px-3 py-1 text-xs font-medium text-[#c0392b] sm:text-sm">
                {labels.outOfStock}
              </span>
            )}
          </div>

          <div className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-am-gold">
              {labels.description}
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-am-ink-soft sm:text-base md:text-lg">
              {product.description}
            </p>
          </div>

          {features.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-am-gold">
                {labels.features}
              </h2>
              <ul className="space-y-2.5 rounded-2xl border border-am-line bg-am-card p-5">
                {features.map((feature, index) => (
                  <li key={`${feature}-${index}`} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-am-gold" />
                    <span className="text-sm leading-relaxed text-am-ink-soft sm:text-base">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <WhatsAppButton
            product={product}
            label={labels.orderOnWhatsApp}
            siteName={siteName}
            siteUrl={siteUrl}
            whatsappNumber={whatsappNumber}
            variant="primary"
            className={`w-full sm:w-auto ${
              !product.inStock ? "pointer-events-none opacity-50" : ""
            }`}
          />
        </motion.div>
      </div>

      {/* Mobile order bar — keeps the price and CTA reachable while scrolling. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-am-line bg-am-card/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-am-muted">{product.name}</p>
            <p className="flex items-baseline gap-2 text-base font-bold text-am-ink">
              {formatPrice(pricing.price)}
              {pricing.listPrice !== null && (
                <span className="text-xs font-normal text-am-muted line-through">
                  {formatPrice(pricing.listPrice)}
                </span>
              )}
            </p>
          </div>
          <WhatsAppButton
            product={product}
            label={labels.orderNow}
            siteName={siteName}
            siteUrl={siteUrl}
            whatsappNumber={whatsappNumber}
            variant="card"
            className={`shrink-0 px-5 py-2.5 ${
              !product.inStock ? "pointer-events-none opacity-50" : ""
            }`}
          />
        </div>
      </div>
    </>
  );
}
