"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { formatPrice, getOrderedImages, isWaterResistant } from "@/lib/utils";
import WhatsAppButton from "./WhatsAppButton";
import ProductTag from "@/components/ui/ProductTag";
import { Check, Shield, Truck, Droplets, ChevronRight } from "lucide-react";

interface ProductDetailProps {
  product: Product;
  whatsappNumber?: string;
  siteName?: string;
  siteUrl?: string;
}

export default function ProductDetailView({
  product,
  whatsappNumber,
  siteName,
  siteUrl,
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const images = getOrderedImages(product);
  const waterResistant = isWaterResistant(product);
  const features = Array.isArray(product.features)
    ? product.features
        .map((feature) => (typeof feature === "string" ? feature.trim() : ""))
        .filter(Boolean)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 xl:gap-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:sticky lg:top-28 lg:self-start"
      >
        <div className="relative aspect-square rounded-2xl overflow-hidden glass-card border border-ld-grey/30 mb-3 sm:mb-4">
          <Image
            src={images[selectedImage]}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {product.featured && (
            <span className="absolute top-4 right-4 px-3 py-1 glass text-ld-gold-light text-xs font-bold rounded-md uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  selectedImage === index
                    ? "border-ld-gold ring-2 ring-ld-gold/20"
                    : "border-ld-grey/40 hover:border-ld-gold/40 opacity-80 hover:opacity-100"
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
        <div className="flex flex-wrap gap-2 mb-4">
          <ProductTag variant="gold">{product.brand}</ProductTag>
          {(Array.isArray(product.tags) ? product.tags : [])
            .map((tag) => String(tag || "").trim())
            .filter(Boolean)
            .map((tag) => (
              <ProductTag key={tag} variant="gold">
                {tag}
              </ProductTag>
            ))}
          {waterResistant && (
            <ProductTag className="gap-1">
              <Droplets className="w-3 h-3 text-ld-gold-light" />
              Water Resistant
            </ProductTag>
          )}
        </div>

        <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white mb-4 leading-tight">
          {product.name}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-ld-grey/30">
          <span className="text-2xl sm:text-3xl font-bold text-ld-gold-light">
            {formatPrice(product.price)}
          </span>
          {product.inStock ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs sm:text-sm border border-green-500/20">
              <Check className="w-3.5 h-3.5" /> In Stock
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs sm:text-sm border border-red-500/20">
              Out of Stock
            </span>
          )}
        </div>

        <div className="mb-8 sm:mb-10">
          <h2 className="text-ld-gold-light text-base sm:text-lg font-semibold mb-4">
            Description
          </h2>
          <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {features.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-ld-gold-light text-base sm:text-lg font-semibold mb-4">
              Features and Specifications
            </h2>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={`${feature}-${index}`} className="flex items-center gap-2.5">
                  <ChevronRight className="w-4 h-4 text-ld-gold shrink-0" />
                  <span className="text-white text-sm sm:text-base leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <WhatsAppButton
          product={product}
          siteName={siteName}
          siteUrl={siteUrl}
          whatsappNumber={whatsappNumber}
          variant="primary"
          className={`w-full sm:w-auto mb-8 ${!product.inStock ? "opacity-50 pointer-events-none" : ""}`}
        />

        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[
            { icon: Shield, label: "Trusted" },
            { icon: Truck, label: "Delivery" },
            { icon: Check, label: "Quality" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-3 sm:p-4 glass-panel rounded-xl text-center"
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-ld-gold-light" />
              <span className="text-ld-silver text-[10px] sm:text-xs">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
