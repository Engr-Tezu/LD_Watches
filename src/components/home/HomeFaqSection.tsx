"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
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
    <section id="faq" className="border-t border-am-line bg-am-bg-alt py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <FadeIn>
              <div className="mb-6 max-w-2xl">
                <h2 className="section-heading">
                  {firstWords} <span className="text-gradient-gold">{lastWord}</span>
                </h2>
                {subtitle && (
                  <p className="mt-3 text-sm text-am-ink-soft sm:text-base">{subtitle}</p>
                )}
                <div className="rule-gold mt-4 h-px w-16" aria-hidden />
              </div>
            </FadeIn>

            <div className="space-y-3">
              {preview.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <FadeIn key={`${faq.question}-${index}`} delay={Math.min(index * 0.05, 0.25)}>
                    <div
                      className={`overflow-hidden rounded-2xl border bg-am-card transition-colors ${
                        isOpen ? "border-am-gold/40" : "border-am-line"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-5"
                        aria-expanded={isOpen}
                      >
                        <span className="text-sm font-medium text-am-ink sm:text-base">
                          {faq.question}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="shrink-0 text-am-gold"
                        >
                          <Plus className="h-5 w-5" />
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
                            <p className="border-t border-am-line px-4 pb-4 pt-3 text-sm leading-relaxed text-am-ink-soft sm:px-5">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </FadeIn>
                );
              })}

              {faqs.length > preview.length && (
                <FadeIn delay={0.2}>
                  <Link
                    href="/faq"
                    className="group mt-2 inline-flex items-center gap-2 text-sm font-semibold text-am-gold transition-colors hover:text-am-gold-deep"
                  >
                    View all {faqs.length} FAQs
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </FadeIn>
              )}
            </div>
          </div>

          <FadeIn delay={0.15} className="hidden lg:block">
            <div className="relative aspect-[4/5] max-h-[480px] w-full overflow-hidden rounded-2xl border border-am-line bg-am-bg-alt">
              <Image
                src={faqImageUrl || "/home-watch.jfif"}
                alt="Premium product"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 0px, 40vw"
                unoptimized
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
