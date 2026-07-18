import { connectDB } from "@/lib/mongodb";
import Watch from "@/models/Watch";
import { buildWatchLookupQuery } from "@/lib/watch-utils";
import { Watch as WatchType } from "@/types/watch";
export async function getWatches(options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
}): Promise<WatchType[]> {
  await connectDB();

  const filter: Record<string, unknown> = {};

  if (options?.category && options.category !== "All") {
    filter.category = options.category;
  }

  if (options?.featured) {
    filter.featured = true;
  }

  if (options?.search) {
    filter.$text = { $search: options.search };
  }

  let query = Watch.find(filter).sort({ createdAt: -1 });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const watches = await query.lean();

  return watches.map((watch) => ({
    ...watch,
    _id: String(watch._id),
    mainImageIndex: watch.mainImageIndex ?? 0,
    waterResistant: watch.waterResistant ?? Boolean(watch.specifications?.waterResistance),
    createdAt: watch.createdAt?.toISOString?.() ?? String(watch.createdAt),
    updatedAt: watch.updatedAt?.toISOString?.() ?? String(watch.updatedAt),
  })) as WatchType[];
}

export async function getWatchBySlug(slug: string): Promise<WatchType | null> {
  await connectDB();

  const watch = await Watch.findOne(buildWatchLookupQuery(slug)).lean();
  if (!watch) return null;

  return {
    ...watch,
    _id: String(watch._id),
    mainImageIndex: watch.mainImageIndex ?? 0,
    waterResistant: watch.waterResistant ?? Boolean(watch.specifications?.waterResistance),
    createdAt: watch.createdAt?.toISOString?.() ?? String(watch.createdAt),
    updatedAt: watch.updatedAt?.toISOString?.() ?? String(watch.updatedAt),
  } as WatchType;
}

export async function getWatchCount(): Promise<number> {
  await connectDB();
  return Watch.countDocuments();
}
