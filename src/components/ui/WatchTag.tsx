import { ReactNode } from "react";

interface WatchTagProps {
  children: ReactNode;
  variant?: "gold" | "muted" | "outline";
  className?: string;
}

export default function WatchTag({
  children,
  variant = "muted",
  className = "",
}: WatchTagProps) {
  const styles = {
    gold: "bg-ld-gold/15 text-ld-gold-light border-ld-gold/25",
    muted: "glass-panel text-ld-light border-ld-grey/30",
    outline: "bg-transparent text-ld-silver border-ld-grey/40",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
