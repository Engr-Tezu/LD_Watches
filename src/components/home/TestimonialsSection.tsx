"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import { Review } from "@/types/site";

interface TestimonialsSectionProps {
  title: string;
  subtitle: string;
  reviews: Review[];
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-am-line bg-am-card p-5 sm:p-6">
      <Quote className="mb-3 h-6 w-6 text-am-gold/40" aria-hidden />

      <div className="mb-4 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, starIndex) => (
          <Star
            key={starIndex}
            className={`h-4 w-4 ${
              starIndex < review.rating
                ? "fill-am-gold-bright text-am-gold-bright"
                : "text-am-line-strong"
            }`}
          />
        ))}
      </div>

      <p className="mb-5 flex-1 text-sm leading-relaxed text-am-ink-soft sm:text-base">
        {review.quote}
      </p>

      <div className="mt-auto border-t border-am-line pt-4">
        <p className="truncate text-sm font-semibold text-am-ink sm:text-base">
          {review.customerName}
        </p>
        {review.roleOrLocation && (
          <p className="truncate text-xs text-am-muted sm:text-sm">{review.roleOrLocation}</p>
        )}
      </div>
    </article>
  );
}

function usePerPage() {
  const [perPage, setPerPage] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setPerPage(3);
      else if (window.innerWidth >= 768) setPerPage(2);
      else setPerPage(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return perPage;
}

export default function TestimonialsSection({
  title,
  subtitle,
  reviews,
}: TestimonialsSectionProps) {
  const perPage = usePerPage();
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [perPage]);

  if (!reviews.length) return null;

  const titleParts = title.trim().split(" ");
  const lastWord = titleParts.pop() || "Say";
  const firstWords = titleParts.join(" ") || "What Our Customers";
  const useSlider = reviews.length > perPage;
  const totalPages = Math.max(1, Math.ceil(reviews.length / perPage));
  const safePage = Math.min(page, totalPages - 1);
  const visible = useSlider
    ? reviews.slice(safePage * perPage, safePage * perPage + perPage)
    : reviews;

  const goPrev = () => setPage((current) => (current - 1 + totalPages) % totalPages);
  const goNext = () => setPage((current) => (current + 1) % totalPages);

  return (
    <section id="reviews" className="border-t border-am-line bg-am-bg py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-8 text-center">
            <h2 className="section-heading">
              {firstWords} <span className="text-gradient-gold">{lastWord}</span>
            </h2>
            {subtitle && (
              <p className="mx-auto mt-3 max-w-lg text-sm text-am-ink-soft sm:text-base">
                {subtitle}
              </p>
            )}
            <div className="rule-gold mx-auto mt-4 h-px w-16" aria-hidden />
          </div>
        </FadeIn>

        {useSlider ? (
          <div className="relative">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${safePage}-${perPage}`}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.28 }}
                  className={`grid gap-4 sm:gap-6 ${
                    perPage === 1 ? "grid-cols-1" : perPage === 2 ? "grid-cols-2" : "grid-cols-3"
                  }`}
                >
                  {visible.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={goPrev}
                className="rounded-full border border-am-line bg-am-card p-2 text-am-ink transition-colors hover:border-am-gold hover:text-am-gold"
                aria-label="Previous reviews"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPage(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === safePage
                        ? "w-6 bg-am-gold"
                        : "w-2 bg-am-line-strong hover:bg-am-muted"
                    }`}
                    aria-label={`Go to review page ${index + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={goNext}
                className="rounded-full border border-am-line bg-am-card p-2 text-am-ink transition-colors hover:border-am-gold hover:text-am-gold"
                aria-label="Next reviews"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <FadeIn key={review._id} delay={Math.min(index * 0.08, 0.3)}>
                <ReviewCard review={review} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
