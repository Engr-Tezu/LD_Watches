"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import ModalPortal from "@/components/ui/ModalPortal";
import WatchForm from "./WatchForm";

interface AdminAddWatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminAddWatchModal({ isOpen, onClose }: AdminAddWatchModalProps) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSuccess = () => {
    onClose();
    setKey((k) => k + 1);
  };

  return (
    <ModalPortal>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            className="relative z-10 flex w-full max-w-[min(100%,56rem)] max-h-[min(92dvh,56rem)] flex-col"
          >
            <div className="bg-ld-charcoal border border-ld-gold/20 rounded-2xl shadow-2xl flex flex-col max-h-[min(92dvh,56rem)] overflow-hidden">
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-ld-grey/50 shrink-0">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Add New Watch</h2>
                  <p className="text-ld-silver text-xs sm:text-sm">Fill in the details below</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-ld-silver hover:text-white hover:bg-ld-grey/50 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto px-5 sm:px-6 py-5 sm:py-6">
                <WatchForm key={key} onSuccess={handleSuccess} onCancel={onClose} />
              </div>
            </div>
          </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
}
