import ProductCard from "./ProductCard";
import { Product } from "@/types/product";
import { ProductLabels } from "@/types/site";

interface ProductGridProps {
  products: Product[];
  labels: ProductLabels;
  whatsappNumber?: string;
  siteName?: string;
  siteUrl?: string;
  /** Grid density from `md` up. `wide` reaches 4 columns, `compact` stops at 3. */
  columns?: "wide" | "compact";
}

export default function ProductGrid({
  products,
  labels,
  whatsappNumber,
  siteName,
  siteUrl,
  columns = "wide",
}: ProductGridProps) {
  if (!products.length) return null;

  return (
    // One card per row on phones — full-width cards keep the image and copy legible.
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6 ${
        columns === "wide" ? "md:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-3"
      }`}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          labels={labels}
          index={index}
          whatsappNumber={whatsappNumber}
          siteName={siteName}
          siteUrl={siteUrl}
        />
      ))}
    </div>
  );
}
