"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Carousel from "@/components/ui/Carousel";
import { CategoryShowcaseItem } from "@/lib/data";

/** Props for the CategoryShowcase component. */
interface CategoryShowcaseProps {
  categories: CategoryShowcaseItem[];
  title: string;
  subtitle?: string;
}

export default function CategoryShowcase({
  categories,
  title,
  subtitle,
}: CategoryShowcaseProps) {
  if (!categories.length) return null;

  return (
    <section id="categories" className="bg-am-bg py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} />

        <div className="mt-8">
          <Carousel
            ariaLabel={title}
            autoPlay
            autoPlayInterval={3000}
            slideClassName="w-[45%] sm:w-[31%] md:w-[23.5%] lg:w-[19%]"
          >
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group block overflow-hidden rounded-2xl border border-am-line bg-am-card transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(23,20,15,0.45)]"
              >
                <div className="relative aspect-square overflow-hidden bg-am-bg-alt">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 24vw, 19vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-[family-name:var(--font-display)] text-3xl text-am-line-strong">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-am-dark/75 via-am-dark/10 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-[family-name:var(--font-display)] text-sm font-semibold text-white sm:text-base">
                        {category.name}
                      </h3>
                      <p className="text-[11px] text-white/75 sm:text-xs">
                        {category.count} {category.count === 1 ? "item" : "items"}
                      </p>
                    </div>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-am-gold-bright text-am-dark transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-8 sm:w-8">
                      <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
