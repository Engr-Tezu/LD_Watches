import Image from "next/image";
import { LOGO_PATH, SITE_NAME } from "@/lib/brand";

type SiteLogoSize = "nav" | "footer" | "admin" | "hero";

const sizeClasses: Record<SiteLogoSize, string> = {
  nav: "h-14 sm:h-16 md:h-[4.5rem]",
  footer: "h-16 sm:h-20",
  admin: "h-10 sm:h-11",
  hero: "h-44 sm:h-56",
};

interface SiteLogoProps {
  size?: SiteLogoSize;
  className?: string;
  priority?: boolean;
  logoUrl?: string;
  alt?: string;
}

export default function SiteLogo({ size = "nav", className = "", priority = false, logoUrl, alt }: SiteLogoProps) {
  const src = logoUrl || LOGO_PATH;
  const label = alt || SITE_NAME;
  return (
    <span className={`relative inline-block shrink-0 aspect-[3/2] ${sizeClasses[size]} ${className}`}>
      <Image
        src={src}
        alt={label}
        fill
        className="object-contain object-center"
        sizes={size === "hero" ? "400px" : size === "footer" ? "240px" : size === "nav" ? "200px" : "120px"}
        priority={priority || size === "nav"}
        quality={95}
      />
    </span>
  );
}
