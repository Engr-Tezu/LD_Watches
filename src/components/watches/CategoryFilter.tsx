"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { WATCH_CATEGORIES } from "@/types/watch";

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";

  const categories = ["All", ...WATCH_CATEGORIES];

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/watches?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-8 sm:mb-10 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible sm:justify-center scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
            currentCategory === category
              ? "bg-ld-gold text-[#1a1200] shadow-md shadow-ld-gold/20"
              : "bg-ld-charcoal text-ld-light border border-ld-grey/50 hover:border-ld-gold/45 hover:text-ld-gold-light"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
