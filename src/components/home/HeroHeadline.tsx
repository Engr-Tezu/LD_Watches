"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import TypewriterRotate from "@/components/ui/TypewriterRotate";
import { SiteSettings } from "@/types/site";

/**
 * Live text under the banner. The banner artwork carries the brand, this
 * carries the message — and stays readable at every width.
 */
export default function HeroHeadline({ settings }: { settings: SiteSettings }) {
  return (
    <div className="bg-am-bg">
      <div className="mx-auto max-w-4xl px-4 py-10 text-center sm:px-6 sm:py-14 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="section-eyebrow">{settings.heroBadge}</span>

          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.15] text-am-ink sm:text-5xl md:text-6xl">
            <span>{settings.heroTitlePrefix} </span>
            <span className="mt-1 block sm:mt-0 sm:inline">
              <TypewriterRotate
                words={settings.heroRotatingWords}
                className="text-gradient-gold"
                typingSpeed={90}
                deletingSpeed={50}
                pauseDuration={2200}
              />
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-am-ink-soft sm:text-base md:text-lg">
            {settings.heroDescription}
          </p>

          <div className="mx-auto mt-7 flex max-w-md flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
            <Link href="/products" className="btn-gold w-full px-8 py-3.5 gold-glow sm:w-auto">
              {settings.heroPrimaryButtonLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/#about" className="btn-outline-gold w-full px-8 py-3.5 sm:w-auto">
              {settings.heroSecondaryButtonLabel}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
