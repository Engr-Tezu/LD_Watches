import slugify from "slugify";
import Product from "@/models/Product";

export function isValidObjectId(value: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(value);
}

export function buildProductLookupQuery(identifier: string) {
  if (isValidObjectId(identifier)) {
    return { $or: [{ slug: identifier }, { _id: identifier }] };
  }
  return { slug: identifier };
}

export function createSlug(name: string): string {
  return slugify(name, { lower: true, strict: true });
}

export async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  let slug = createSlug(name);
  let counter = 1;

  while (true) {
    const query: Record<string, unknown> = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await Product.findOne(query);
    if (!existing) break;

    slug = `${createSlug(name)}-${counter}`;
    counter++;
  }

  return slug;
}

export function serializeProduct<T extends { _id: unknown; toObject?: () => Record<string, unknown> }>(
  product: T
): Record<string, unknown> {
  const obj = product.toObject ? product.toObject() : (product as Record<string, unknown>);
  return {
    ...obj,
    _id: String(obj._id),
    createdAt: obj.createdAt instanceof Date ? obj.createdAt.toISOString() : obj.createdAt,
    updatedAt: obj.updatedAt instanceof Date ? obj.updatedAt.toISOString() : obj.updatedAt,
  };
}
