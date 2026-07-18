"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Pencil, Trash2, Droplets, Star, Check } from "lucide-react";
import { Watch } from "@/types/watch";
import { formatPrice, getOrderedImages, isWaterResistant } from "@/lib/utils";
import ModalPortal from "@/components/ui/ModalPortal";

interface AdminWatchViewModalProps {
  watch: Watch | null;
  onClose: () => void;
  onDelete: (watch: Watch) => void;
}

export default function AdminWatchViewModal({
  watch,
  onClose,
  onDelete,
}: AdminWatchViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!watch) return;
    setSelectedImage(0);
  }, [watch]);

  useEffect(() => {
    if (!watch) return;

    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [watch, onClose]);

  const images = watch ? getOrderedImages(watch) : [];
  const waterResistant = watch ? isWaterResistant(watch) : false;

  return (
    <ModalPortal>
      <AnimatePresence>
        {watch && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6"
            role="presentation"
          >
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={onClose}
              aria-label="Close dialog"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="watch-view-title"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex w-full max-w-[min(100%,64rem)] max-h-[min(92dvh,56rem)] flex-col overflow-hidden rounded-2xl border border-ld-gold/20 bg-ld-charcoal shadow-2xl"
            >
              <div className="flex shrink-0 items-start justify-between gap-3 border-b border-ld-grey/50 px-4 py-4 sm:px-6">
                <div className="min-w-0 pr-2">
                  <p className="mb-1 text-xs font-medium uppercase tracking-widest text-ld-gold-light">
                    Watch Details
                  </p>
                  <h2 id="watch-view-title" className="text-lg font-bold text-white sm:text-2xl">
                    {watch.name}
                  </h2>
                  <p className="mt-1 text-sm text-ld-silver">
                    {watch.brand} · {watch.category}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 rounded-lg p-2 text-ld-silver transition-colors hover:bg-ld-grey/50 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:gap-8">
                  <div className="mx-auto w-full max-w-md md:max-w-none">
                    <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl border border-ld-grey/40 bg-ld-dark">
                      <Image
                        src={images[selectedImage]}
                        alt={watch.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 90vw, 480px"
                      />
                      {watch.featured && (
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-ld-gold/90 px-2.5 py-1 text-xs font-bold uppercase text-[#1a1200]">
                          <Star className="h-3 w-3" fill="currentColor" />
                          Featured
                        </span>
                      )}
                    </div>

                    {images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {images.map((img, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedImage(index)}
                            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-20 sm:w-20 ${
                              selectedImage === index
                                ? "border-ld-gold ring-2 ring-ld-gold/20"
                                : "border-ld-grey/40 opacity-80 hover:opacity-100"
                            }`}
                          >
                            <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {watch.inStock ? (
                        <span className="inline-flex items-center gap-1 rounded border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-sm text-green-400">
                          <Check className="h-3.5 w-3.5" /> In Stock
                        </span>
                      ) : (
                        <span className="rounded border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-sm text-red-400">
                          Out of Stock
                        </span>
                      )}
                      {waterResistant && (
                        <span className="inline-flex items-center gap-1 rounded border border-ld-gold/20 bg-ld-gold/10 px-3 py-1.5 text-sm text-ld-gold-light">
                          <Droplets className="h-3.5 w-3.5" />
                          Water Resistant
                        </span>
                      )}
                    </div>

                    <p className="mb-5 text-2xl font-bold text-ld-gold-light sm:text-3xl">
                      {formatPrice(watch.price)}
                    </p>

                    <div className="glass-panel mb-4 rounded-xl p-4 sm:p-5">
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ld-gold-light">
                        Description
                      </h3>
                      <p className="whitespace-pre-line text-sm leading-relaxed text-ld-light sm:text-base">
                        {watch.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="glass-panel rounded-lg p-4">
                        <p className="mb-1 text-xs text-ld-silver">Slug</p>
                        <p className="break-all text-white">{watch.slug}</p>
                      </div>
                      <div className="glass-panel rounded-lg p-4">
                        <p className="mb-1 text-xs text-ld-silver">Images</p>
                        <p className="text-lg font-medium text-white">{watch.images.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-ld-grey/50 bg-ld-charcoal px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-5 py-2.5 text-sm text-ld-silver transition-colors hover:text-white"
                >
                  Close
                </button>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <button
                    type="button"
                    onClick={() => onDelete(watch)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-5 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                  <Link
                    href={`/admin/watches/${watch._id}/edit`}
                    onClick={onClose}
                    className="inline-flex items-center justify-center gap-2 rounded-lg btn-gold px-6 py-2.5 text-sm"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Watch
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
}
