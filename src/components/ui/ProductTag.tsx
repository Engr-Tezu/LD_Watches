import { ReactNode } from "react";

interface ProductTagProps {
  children: ReactNode;
  variant?: "gold" | "silver" | "muted" | "outline";
  className?: string;
}

export default function ProductTag({
  children,
  variant = "muted",
  className = "",
}: ProductTagProps) {
  const styles = {
    gold: "bg-[#c9a227] text-[#1a1200] border-[#c9a227] font-semibold",
    silver: "bg-[#c9a227] text-[#1a1200] border-[#c9a227] font-semibold",
    muted: "bg-ld-charcoal text-ld-light border-ld-grey/50",
    outline: "bg-transparent text-ld-silver border-ld-grey/40",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
