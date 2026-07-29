import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { buildProductLookupQuery } from "@/lib/product-utils";
import { Product as ProductType } from "@/types/product";

function normalizeFeatures(features: unknown): string[] {
  if (!Array.isArray(features)) return [];
  return features
    .map((feature) => {
      if (typeof feature === "string") return feature.trim();
      if (feature && typeof feature === "object") {
        const record = feature as { label?: string; value?: string };
        const label = String(record.label || "").trim();
        const value = String(record.value || "").trim();
        if (label && value) return `${label}: ${value}`;
        return label || value;
      }
      return "";
    })
    .filter(Boolean);
}

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.map((tag) => String(tag || "").trim()).filter(Boolean);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function serializeProduct(item: Record<string, unknown>): ProductType {
  return {
    ...item,
    _id: String(item._id),
    mainImageIndex: (item.mainImageIndex as number | undefined) ?? 0,
    waterResistant:
      (item.waterResistant as boolean | undefined) ??
      Boolean((item.specifications as Record<string, string> | undefined)?.waterResistance),
    features: normalizeFeatures(item.features),
    tags: normalizeTags(item.tags),
    createdAt:
      item.createdAt instanceof Date
        ? item.createdAt.toISOString()
        : String(item.createdAt),
    updatedAt:
      item.updatedAt instanceof Date
        ? item.updatedAt.toISOString()
        : String(item.updatedAt),
  } as ProductType;
}

export async function getProducts(options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
}): Promise<ProductType[]> {
  await connectDB();

  const filter: Record<string, unknown> = {};

  if (options?.category && options.category !== "All") {
    filter.category = options.category;
  }

  if (options?.featured) {
    filter.featured = true;
  }

  const search = options?.search?.trim();
  if (search) {
    const pattern = escapeRegex(search);
    filter.$or = [
      { name: { $regex: pattern, $options: "i" } },
      { brand: { $regex: pattern, $options: "i" } },
      { description: { $regex: pattern, $options: "i" } },
      { tags: { $regex: pattern, $options: "i" } },
    ];
  }

  let query = Product.find(filter).sort({ createdAt: -1 });
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const items = await query.lean();
  return items.map((item) => serializeProduct(item as Record<string, unknown>));
}

export async function getProductBySlug(slug: string): Promise<ProductType | null> {
  await connectDB();

  const item = await Product.findOne(buildProductLookupQuery(slug)).lean();
  if (!item) return null;

  return serializeProduct(item as Record<string, unknown>);
}

export async function getProductCount(): Promise<number> {
  await connectDB();
  return Product.countDocuments();
}
