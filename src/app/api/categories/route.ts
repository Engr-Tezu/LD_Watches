import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import CategoryModel from "@/models/Category";
import { connectDB } from "@/lib/mongodb";
import { createCategorySlug, ensureDefaultCategories, getCategories } from "@/lib/site";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    await ensureDefaultCategories();

    const body = await request.json();
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const sortOrder =
      body.sortOrder === "" || body.sortOrder === null || body.sortOrder === undefined
        ? 0
        : Number(body.sortOrder);
    const isActive = body.isActive !== false;

    if (!name) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 });
    }

    const slug = createCategorySlug(name);
    const existing = await CategoryModel.findOne({ slug });
    if (existing) {
      return NextResponse.json({ success: false, error: "Category already exists" }, { status: 400 });
    }

    const category = await CategoryModel.create({ name, slug, description, sortOrder, isActive });
    return NextResponse.json({ success: true, data: { ...category.toObject(), _id: String(category._id) } }, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 });
  }
}
