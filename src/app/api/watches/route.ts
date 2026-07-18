import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Watch from "@/models/Watch";
import { getAdminSession } from "@/lib/auth";
import { generateUniqueSlug, serializeWatch } from "@/lib/watch-utils";
import { WATCH_CATEGORIES } from "@/types/watch";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "0", 10);

    const filter: Record<string, unknown> = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    let query = Watch.find(filter).sort({ createdAt: -1 });

    if (limit > 0) {
      query = query.limit(limit);
    }

    const watches = await query.lean();
    const serialized = watches.map((watch) => ({
      ...watch,
      _id: String(watch._id),
      mainImageIndex: watch.mainImageIndex ?? 0,
      waterResistant: watch.waterResistant ?? false,
      createdAt: watch.createdAt?.toISOString?.() ?? watch.createdAt,
      updatedAt: watch.updatedAt?.toISOString?.() ?? watch.updatedAt,
    }));

    return NextResponse.json({ success: true, data: serialized });
  } catch (error) {
    console.error("GET /api/watches error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch watches" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const {
      name,
      description,
      price,
      category,
      brand,
      images,
      mainImageIndex,
      waterResistant,
      inStock,
      featured,
    } = body;

    if (!name || !description || price === undefined || !category || !brand) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!WATCH_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 }
      );
    }

    const slug = await generateUniqueSlug(name);
    const imageList = images || [];
    const safeMainIndex = Math.min(mainImageIndex ?? 0, Math.max(0, imageList.length - 1));

    const watch = await Watch.create({
      name,
      slug,
      description,
      price: Number(price),
      category,
      brand,
      images: imageList,
      mainImageIndex: safeMainIndex,
      waterResistant: waterResistant ?? false,
      inStock: inStock ?? true,
      featured: featured ?? false,
    });

    return NextResponse.json(
      { success: true, data: serializeWatch(watch) },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/watches error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create watch" },
      { status: 500 }
    );
  }
}
