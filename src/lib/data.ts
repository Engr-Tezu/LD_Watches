import type { PipelineStage } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { buildProductLookupQuery } from "@/lib/product-utils";
import { DEFAULT_PRODUCT_SORT, ProductSort } from "@/lib/product-sort";
import { Product as ProductType } from "@/types/product";

export type { ProductSort };
export { PRODUCT_SORT_OPTIONS, normalizeSort } from "@/lib/product-sort";

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

const SORT_STAGES: Record<ProductSort, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  "price-asc": { price: 1, createdAt: -1 },
  "price-desc": { price: -1, createdAt: -1 },
  "name-asc": { name: 1 },
};

function buildProductFilter(options?: {
  category?: string;
  featured?: boolean;
  search?: string;
  inStockOnly?: boolean;
}): Record<string, unknown> {
  const filter: Record<string, unknown> = {};

  if (options?.category && options.category !== "All") {
    filter.category = options.category;
  }

  if (options?.featured) {
    filter.featured = true;
  }

  if (options?.inStockOnly) {
    filter.inStock = true;
  }

  const search = options?.search?.trim();
  if (search) {
    const pattern = escapeRegex(search);
    filter.$or = [
      { name: { $regex: pattern, $options: "i" } },
      { brand: { $regex: pattern, $options: "i" } },
      { category: { $regex: pattern, $options: "i" } },
      { description: { $regex: pattern, $options: "i" } },
      { tags: { $regex: pattern, $options: "i" } },
    ];
  }

  return filter;
}

/**
 * Mongo expression for what a product actually sells for, mirroring
 * `getProductPricing()` in lib/utils. Needed so "price: low to high" sorts by
 * the discounted price rather than the pre-discount one.
 */
const EFFECTIVE_PRICE_EXPR = {
  $let: {
    vars: {
      pct: { $ifNull: ["$discountPercentage", 0] },
    },
    in: {
      $cond: [
        { $gt: ["$$pct", 0] },
        { $round: [{ $multiply: ["$price", { $subtract: [1, { $divide: ["$$pct", 100] }] }] }, 0] },
        "$price",
      ],
    },
  },
};

export async function getProducts(options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
  skip?: number;
  search?: string;
  sort?: ProductSort;
  inStockOnly?: boolean;
}): Promise<ProductType[]> {
  await connectDB();

  const filter = buildProductFilter(options);
  const sort = options?.sort ?? DEFAULT_PRODUCT_SORT;

  if (sort === "price-asc" || sort === "price-desc") {
    const direction = sort === "price-asc" ? 1 : -1;
    const pipeline: PipelineStage[] = [
      { $match: filter },
      { $addFields: { effectivePrice: EFFECTIVE_PRICE_EXPR } },
      { $sort: { effectivePrice: direction, createdAt: -1 } },
    ];
    if (options?.skip) pipeline.push({ $skip: options.skip });
    if (options?.limit) pipeline.push({ $limit: options.limit });
    pipeline.push({ $unset: "effectivePrice" });

    const rows = await Product.aggregate<Record<string, unknown>>(pipeline);
    return rows.map((row) => serializeProduct(row));
  }

  let query = Product.find(filter).sort(SORT_STAGES[sort]);
  if (options?.skip) {
    query = query.skip(options.skip);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const items = await query.lean();
  return items.map((item) => serializeProduct(item as Record<string, unknown>));
}

/**
 * Same filters as {@link getProducts}, but returns the total match count so the
 * collection page can paginate without loading every document.
 */
export async function countProducts(options?: {
  category?: string;
  featured?: boolean;
  search?: string;
  inStockOnly?: boolean;
}): Promise<number> {
  await connectDB();
  return Product.countDocuments(buildProductFilter(options));
}

export interface CategoryShowcaseItem {
  name: string;
  count: number;
  image: string | null;
}

/**
 * Product count + one representative image per category, for the homepage tiles.
 */
export async function getCategoryShowcase(): Promise<CategoryShowcaseItem[]> {
  await connectDB();

  const rows = await Product.aggregate<{
    _id: string;
    count: number;
    images: string[];
    mainImageIndex: number;
  }>([
    { $sort: { featured: -1, createdAt: -1 } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        images: { $first: "$images" },
        mainImageIndex: { $first: "$mainImageIndex" },
      },
    },
    { $sort: { count: -1, _id: 1 } },
  ]);

  return rows
    .filter((row) => Boolean(row._id))
    .map((row) => {
      const images = Array.isArray(row.images) ? row.images.filter(Boolean) : [];
      const index = Math.min(Math.max(row.mainImageIndex ?? 0, 0), Math.max(images.length - 1, 0));
      return {
        name: String(row._id),
        count: row.count,
        image: images[index] || images[0] || null,
      };
    });
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
