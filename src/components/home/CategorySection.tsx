"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WATCH_CATEGORIES } from "@/types/watch";

export default function CategorySection() {
  return (
    <section className="py-16 sm:py-20 bg-ld-dark border-y border-ld-grey/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="section-heading mb-3 sm:mb-4">
            Browse by <span className="text-gradient-gold">Category</span>
          </h2>
          <p className="text-ld-silver max-w-xl mx-auto text-sm sm:text-base px-2">
            Find the perfect timepiece that matches your style
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2 sm:gap-3 justify-center"
        >
          {WATCH_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/watches?category=${category}`}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 glass-panel text-ld-light hover:border-ld-gold/50 hover:text-ld-gold-light hover:bg-ld-gold/10"
            >
              {category}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
