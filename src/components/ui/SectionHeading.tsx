import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "./FadeIn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  /** Optional "view all" style link rendered beside the heading on wide screens. */
  action?: { href: string; label: string };
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  align = "left",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <FadeIn>
      <div
        className={
          centered
            ? "text-center"
            : "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        }
      >
        <div className={centered ? "mx-auto max-w-2xl" : "max-w-2xl"}>
          {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
          <h2 className="section-heading mt-2">{title}</h2>
          {subtitle && (
            <p className="mt-3 text-sm leading-relaxed text-am-ink-soft sm:text-base">{subtitle}</p>
          )}
          <div
            className={`rule-gold mt-4 h-px w-16 ${centered ? "mx-auto" : ""}`}
            aria-hidden
          />
        </div>

        {action && (
          <Link
            href={action.href}
            className={`group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-am-gold transition-colors hover:text-am-gold-deep ${
              centered ? "mt-5 justify-center" : ""
            }`}
          >
            {action.label}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </FadeIn>
  );
}
