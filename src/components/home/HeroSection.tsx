"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import TypewriterRotate from "@/components/ui/TypewriterRotate";

const ROTATING_WORDS = ["Elegance", "Precision", "Luxury", "Heritage", "Craftsmanship"];

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ld-black via-ld-dark to-ld-charcoal" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-ld-gold/12 rounded-full blur-3xl animate-pulse-gold" />
        <div
          className="absolute bottom-1/4 -right-20 w-64 sm:w-80 h-64 sm:h-80 bg-ld-gold/8 rounded-full blur-3xl animate-pulse-gold"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-ld-gold) 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12">
        <div className="w-full max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 sm:mb-8">
              <Sparkles className="w-4 h-4 text-ld-gold-light" />
              <span className="text-ld-gold-light text-xs sm:text-sm tracking-[0.2em] uppercase font-medium">
                Premium Timepieces
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-3 sm:mb-4 leading-[1.1]">
              <span className="text-white">Timeless </span>
              <span className="block sm:inline mt-1 sm:mt-0">
                <TypewriterRotate
                  words={ROTATING_WORDS}
                  className="text-gradient-gold"
                  typingSpeed={90}
                  deletingSpeed={50}
                  pauseDuration={2200}
                />
              </span>
            </h1>

            <p className="text-ld-light text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed mt-5 sm:mt-6">
              Discover curated luxury watches that define sophistication.
              Each piece tells a story of craftsmanship and prestige.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
              <Link href="/watches" className="w-full sm:w-auto">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-gold w-full sm:w-auto px-8 py-3.5 sm:py-4 gold-glow cursor-pointer text-sm sm:text-base"
                >
                  Explore Collection
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Link>

              <Link href="/#about" className="w-full sm:w-auto">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-outline-gold w-full sm:w-auto px-8 py-3.5 sm:py-4 cursor-pointer text-sm sm:text-base"
                >
                  Learn More
                </motion.span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-8 sm:mt-10 flex justify-center"
          >
            <div className="w-6 h-10 border-2 border-ld-gold/35 rounded-full flex justify-center pt-2 glass">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-ld-gold-light rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
