import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getAdminSession } from "@/lib/auth";
import { generateUniqueSlug, serializeProduct, clampDiscount } from "@/lib/product-utils";
import { categoryExists } from "@/lib/site";

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

    let query = Product.find(filter).sort({ createdAt: -1 });
    if (limit > 0) query = query.limit(limit);

    const items = await query.lean();
    const serialized = items.map((item) => ({
      ...item,
      _id: String(item._id),
      mainImageIndex: item.mainImageIndex ?? 0,
      waterResistant: item.waterResistant ?? false,
      features: Array.isArray(item.features) ? item.features : [],
      tags: Array.isArray(item.tags) ? item.tags : [],
      createdAt: item.createdAt?.toISOString?.() ?? item.createdAt,
      updatedAt: item.updatedAt?.toISOString?.() ?? item.updatedAt,
    }));

    return NextResponse.json({ success: true, data: serialized });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch items" }, { status: 500 });
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
      discountPercentage,
      category,
      brand,
      images,
      mainImageIndex,
      waterResistant,
      inStock,
      featured,
      features,
      tags,
    } = body;

    if (!name || !description || price === undefined || !category || !brand) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (!(await categoryExists(category))) {
      return NextResponse.json({ success: false, error: "Invalid category" }, { status: 400 });
    }

    const slug = await generateUniqueSlug(name);
    const imageList = images || [];
    const safeMainIndex = Math.min(mainImageIndex ?? 0, Math.max(0, imageList.length - 1));
    const featureList = Array.isArray(features)
      ? features
          .map((feature: unknown) => {
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
          .filter(Boolean)
      : [];
    const tagList = Array.isArray(tags)
      ? tags.map((tag: unknown) => String(tag || "").trim()).filter(Boolean)
      : [];

    const item = await Product.create({
      name,
      slug,
      description,
      price: Number(price),
      discountPercentage: clampDiscount(discountPercentage),
      category,
      brand,
      images: imageList,
      mainImageIndex: safeMainIndex,
      waterResistant: waterResistant ?? false,
      inStock: inStock ?? true,
      featured: featured ?? false,
      features: featureList,
      tags: tagList,
    });

    return NextResponse.json({ success: true, data: serializeProduct(item) }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ success: false, error: "Failed to create item" }, { status: 500 });
  }
}
