"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Watch } from "@/types/watch";
import { formatPrice, getMainImage, cn, isWaterResistant } from "@/lib/utils";
import WhatsAppButton from "./WhatsAppButton";
import WatchTag from "@/components/ui/WatchTag";
import { Droplets, ArrowUpRight } from "lucide-react";

interface WatchCardProps {
  watch: Watch;
  index?: number;
}

export default function WatchCard({ watch, index = 0 }: WatchCardProps) {
  const imageUrl = getMainImage(watch);
  const waterResistant = isWaterResistant(watch);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.35) }}
      className="group card-surface overflow-hidden flex flex-col h-full hover:border-ld-gold/25 transition-all duration-300"
    >
      <Link href={`/watches/${watch.slug}`} className="block flex-1">
        <div className="relative aspect-[4/5] sm:aspect-[5/6] overflow-hidden bg-ld-dark">
          <Image
            src={imageUrl}
            alt={watch.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-ld-black/80 via-ld-black/10 to-transparent" />

          {watch.featured && (
            <span className="absolute top-3 right-3 px-2.5 py-1 glass text-ld-gold-light text-[10px] sm:text-xs font-bold rounded-md uppercase tracking-wider">
              Featured
            </span>
          )}

          {!watch.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-3 py-1.5 glass-panel text-white text-xs sm:text-sm font-medium rounded-lg">
                Out of Stock
              </span>
            </div>
          )}

          <span className="absolute bottom-3 right-3 p-2 rounded-full glass opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight className="w-4 h-4 text-ld-gold-light" />
          </span>
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
            <WatchTag variant="gold">{watch.category}</WatchTag>
            <WatchTag>{watch.brand}</WatchTag>
            {waterResistant && (
              <WatchTag className="gap-1">
                <Droplets className="w-3 h-3 text-ld-gold-light shrink-0" />
                Water Resistant
              </WatchTag>
            )}
          </div>

          <h3 className="font-[family-name:var(--font-display)] text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-ld-gold-light transition-colors line-clamp-2 leading-snug">
            {watch.name}
          </h3>

          <p className="text-ld-silver text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
            {watch.description}
          </p>

          <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-ld-grey/30">
            <span className="text-ld-gold-light font-bold text-lg sm:text-xl">
              {formatPrice(watch.price)}
            </span>
            <span className="text-ld-silver text-xs opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
              View details
            </span>
          </div>
        </div>
      </Link>

      <div
        className="px-4 sm:px-5 pb-4 sm:pb-5"
        onClick={(e) => e.stopPropagation()}
      >
        <WhatsAppButton
          watch={watch}
          variant="card"
          className={cn("w-full", !watch.inStock && "opacity-50 pointer-events-none")}
        />
      </div>
    </motion.article>
  );
}
