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
    gold: "bg-am-gold-tint text-am-gold-deep border-am-gold/30 font-semibold",
    silver: "bg-am-gold-tint text-am-gold-deep border-am-gold/30 font-semibold",
    muted: "bg-am-bg-alt text-am-ink-soft border-am-line",
    outline: "bg-transparent text-am-muted border-am-line-strong",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
