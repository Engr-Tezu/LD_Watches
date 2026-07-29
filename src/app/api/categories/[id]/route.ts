import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import CategoryModel from "@/models/Category";
import { connectDB } from "@/lib/mongodb";
import { createCategorySlug } from "@/lib/site";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
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
    const duplicate = await CategoryModel.findOne({ slug, _id: { $ne: id } });
    if (duplicate) {
      return NextResponse.json({ success: false, error: "Category already exists" }, { status: 400 });
    }

    const category = await CategoryModel.findByIdAndUpdate(id, { name, slug, description, sortOrder, isActive }, { new: true });
    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { ...category.toObject(), _id: String(category._id) } });
  } catch (error) {
    console.error("PUT /api/categories/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 });
  }
}
