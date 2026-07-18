"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Watch } from "@/types/watch";
import { formatPrice, getOrderedImages, isWaterResistant } from "@/lib/utils";
import WhatsAppButton from "./WhatsAppButton";
import WatchTag from "@/components/ui/WatchTag";
import { Check, Shield, Truck, Droplets } from "lucide-react";

interface WatchDetailProps {
  watch: Watch;
}

export default function WatchDetailView({ watch }: WatchDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const images = getOrderedImages(watch);
  const waterResistant = isWaterResistant(watch);

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
            alt={watch.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {watch.featured && (
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
          <WatchTag variant="gold">{watch.category}</WatchTag>
          <WatchTag>{watch.brand}</WatchTag>
          {waterResistant && (
            <WatchTag className="gap-1">
              <Droplets className="w-3 h-3 text-ld-gold-light" />
              Water Resistant
            </WatchTag>
          )}
        </div>

        <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white mb-4 leading-tight">
          {watch.name}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-ld-grey/30">
          <span className="text-2xl sm:text-3xl font-bold text-ld-gold-light">
            {formatPrice(watch.price)}
          </span>
          {watch.inStock ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs sm:text-sm border border-green-500/20">
              <Check className="w-3.5 h-3.5" /> In Stock
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs sm:text-sm border border-red-500/20">
              Out of Stock
            </span>
          )}
        </div>

        <div className="glass-panel rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-ld-gold-light text-xs uppercase tracking-widest font-semibold mb-3">
            Description
          </h2>
          <p className="text-ld-light text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {watch.description}
          </p>
        </div>

        <WhatsAppButton
          watch={watch}
          variant="primary"
          className={`w-full sm:w-auto mb-8 ${!watch.inStock ? "opacity-50 pointer-events-none" : ""}`}
        />

        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[
            { icon: Shield, label: "Authentic" },
            { icon: Truck, label: "Free Delivery" },
            { icon: Check, label: "Warranty" },
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
