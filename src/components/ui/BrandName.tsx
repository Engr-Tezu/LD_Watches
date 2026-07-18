import { SITE_NAME_SHORT } from "@/lib/brand";

interface BrandNameProps {
  className?: string;
  suffixClassName?: string;
}

export default function BrandName({
  className = "",
  suffixClassName = "text-gradient-gold",
}: BrandNameProps) {
  return (
    <span className={className}>
      <span className="text-white">{SITE_NAME_SHORT}</span>
      <span className={suffixClassName}> WATCHES</span>
    </span>
  );
}
