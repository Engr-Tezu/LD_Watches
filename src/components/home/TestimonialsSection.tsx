"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
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
    <article className="glass-panel rounded-2xl p-5 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-start gap-1.5 mb-4">
        {Array.from({ length: 5 }).map((_, starIndex) => (
          <Star
            key={starIndex}
            className={`w-4 h-4 ${
              starIndex < review.rating ? "text-ld-gold fill-ld-gold" : "text-ld-grey"
            }`}
          />
        ))}
      </div>
      <p className="text-white/90 text-sm sm:text-base leading-relaxed flex-1 mb-5 text-left">
        “{review.quote}”
      </p>
      <div className="flex items-center justify-start gap-3 mt-auto pt-4">
        <div className="min-w-0 text-left">
          <p className="text-white font-semibold text-base sm:text-lg truncate">
            {review.customerName}
          </p>
          {review.roleOrLocation && (
            <p className="text-ld-silver text-xs sm:text-sm truncate">{review.roleOrLocation}</p>
          )}
        </div>
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
    <section id="reviews" className="py-10 sm:py-12 bg-ld-black border-t border-ld-grey/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="section-heading mb-2">
              {firstWords} <span className="text-gradient-gold">{lastWord}</span>
            </h2>
            {subtitle && (
              <p className="text-ld-silver text-sm sm:text-base max-w-lg mx-auto">{subtitle}</p>
            )}
            <div className="w-14 h-px bg-gradient-to-r from-transparent via-ld-gold/60 to-transparent mx-auto mt-4" />
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
                    perPage === 1
                      ? "grid-cols-1"
                      : perPage === 2
                        ? "grid-cols-2"
                        : "grid-cols-3"
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
                className="p-2 rounded-full border border-ld-gold/25 text-ld-gold hover:bg-ld-gold/10 transition-colors"
                aria-label="Previous reviews"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPage(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === safePage ? "w-6 bg-ld-gold" : "w-2 bg-ld-grey hover:bg-ld-silver"
                    }`}
                    aria-label={`Go to review page ${index + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={goNext}
                className="p-2 rounded-full border border-ld-gold/25 text-ld-gold hover:bg-ld-gold/10 transition-colors"
                aria-label="Next reviews"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
