import slugify from "slugify";
import Watch from "@/models/Watch";

export function isValidObjectId(value: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(value);
}

export function buildWatchLookupQuery(identifier: string) {
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

    const existing = await Watch.findOne(query);
    if (!existing) break;

    slug = `${createSlug(name)}-${counter}`;
    counter++;
  }

  return slug;
}

export function serializeWatch<T extends { _id: unknown; toObject?: () => Record<string, unknown> }>(
  watch: T
): Record<string, unknown> {
  const obj = watch.toObject ? watch.toObject() : (watch as Record<string, unknown>);
  return {
    ...obj,
    _id: String(obj._id),
    createdAt: obj.createdAt instanceof Date ? obj.createdAt.toISOString() : obj.createdAt,
    updatedAt: obj.updatedAt instanceof Date ? obj.updatedAt.toISOString() : obj.updatedAt,
  };
}
