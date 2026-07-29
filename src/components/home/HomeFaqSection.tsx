"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import { FaqItem } from "@/types/site";

interface HomeFaqSectionProps {
  title: string;
  subtitle: string;
  faqs: FaqItem[];
  faqImageUrl?: string;
}

export default function HomeFaqSection({
  title,
  subtitle,
  faqs,
  faqImageUrl,
}: HomeFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs.length) return null;

  const titleParts = title.trim().split(" ");
  const lastWord = titleParts.pop() || "Questions";
  const firstWords = titleParts.join(" ") || "Frequently Asked";
  const preview = faqs.slice(0, 5);

  return (
    <section id="faq" className="py-10 sm:py-12 bg-ld-black border-t border-ld-grey/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-left md:text-left mb-4 sm:mb-6 max-w-2xl">
            <h2 className="section-heading mb-2">
              {firstWords} <span className="text-gradient-gold">{lastWord}</span>
            </h2>
            {subtitle && (
              <p className="text-ld-silver text-sm sm:text-base">{subtitle}</p>
            )}
            <div className="w-14 h-px bg-gradient-to-r from-ld-gold/60 to-transparent mt-4" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-3 order-1 mt-[-0.35rem]">
            {preview.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <FadeIn key={`${faq.question}-${index}`} delay={Math.min(index * 0.05, 0.25)}>
                  <div className="glass-panel rounded-2xl overflow-hidden border border-ld-grey/30">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full px-4 sm:px-5 py-4 flex items-start justify-between gap-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-white font-medium text-sm sm:text-base">
                        {faq.question}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-ld-gold shrink-0 text-xl leading-none"
                      >
                        +
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 sm:px-5 pb-4 text-ld-silver text-sm leading-relaxed border-t border-ld-grey/30 pt-3">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FadeIn>
              );
            })}

            {faqs.length > 5 && (
              <FadeIn delay={0.2}>
                <div className="pt-2">
                  <Link
                    href="/faq"
                    className="text-ld-gold-light text-sm font-medium hover:text-ld-gold transition-colors"
                  >
                    View all FAQs →
                  </Link>
                </div>
              </FadeIn>
            )}
          </div>

          <FadeIn delay={0.15} className="hidden lg:block order-2">
            <div className="relative aspect-[4/5] max-h-[420px] w-full rounded-2xl overflow-hidden border border-ld-gold/15 bg-ld-dark mt-[-0.5rem]">
              <Image
                src={faqImageUrl || "/home-watch.jfif"}
                alt="Premium product"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 0px, 40vw"
                unoptimized
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ld-black/50 via-transparent to-transparent" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
