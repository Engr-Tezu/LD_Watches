import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getAdminSession } from "@/lib/auth";
import { generateUniqueSlug, serializeProduct, clampDiscount } from "@/lib/product-utils";
import { categoryExists } from "@/lib/site";
import { getProducts, countProducts, normalizeSort } from "@/lib/data";

const MAX_PAGE_SIZE = 48;

/**
 * Paginated product feed. Backs the homepage's infinite-scroll section, so it
 * returns `total` / `hasMore` alongside the page of items.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search") || searchParams.get("q");
    const sort = normalizeSort(searchParams.get("sort"));
    const inStockOnly = searchParams.get("stock") === "in";

    const rawLimit = Number.parseInt(searchParams.get("limit") || "12", 10);
    const limit = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, Number.isFinite(rawLimit) ? rawLimit : 12)
    );

    const rawPage = Number.parseInt(searchParams.get("page") || "1", 10);
    const page = Math.max(1, Number.isFinite(rawPage) ? rawPage : 1);

    const filters = {
      category: category && category !== "All" ? category : undefined,
      featured: featured === "true" ? true : undefined,
      search: search || undefined,
      inStockOnly,
    };

    const [total, items] = await Promise.all([
      countProducts(filters),
      getProducts({ ...filters, sort, limit, skip: (page - 1) * limit }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      page,
      limit,
      total,
      hasMore: page * limit < total,
    });
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
