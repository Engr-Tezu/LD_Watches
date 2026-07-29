import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getAdminSession } from "@/lib/auth";
import { generateUniqueSlug, serializeProduct, buildProductLookupQuery } from "@/lib/product-utils";
import { categoryExists } from "@/lib/site";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    const product = await Product.findOne(buildProductLookupQuery(id)).lean();

    if (!product) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        _id: String(product._id),
        mainImageIndex: product.mainImageIndex ?? 0,
        waterResistant: product.waterResistant ?? false,
        features: Array.isArray(product.features) ? product.features : [],
        tags: Array.isArray(product.tags) ? product.tags : [],
        createdAt: product.createdAt?.toISOString?.() ?? product.createdAt,
        updatedAt: product.updatedAt?.toISOString?.() ?? product.updatedAt,
      },
    });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const existing = await Product.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    if (body.category && !(await categoryExists(body.category))) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.price !== undefined) updates.price = Number(body.price);
    if (body.category !== undefined) updates.category = body.category;
    if (body.brand !== undefined) updates.brand = body.brand;
    if (body.images !== undefined) updates.images = body.images;
    if (body.mainImageIndex !== undefined) updates.mainImageIndex = Number(body.mainImageIndex);
    if (body.waterResistant !== undefined) updates.waterResistant = Boolean(body.waterResistant);
    if (body.inStock !== undefined) updates.inStock = Boolean(body.inStock);
    if (body.featured !== undefined) updates.featured = Boolean(body.featured);
    if (body.features !== undefined) {
      updates.features = Array.isArray(body.features)
        ? body.features
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
    }
    if (body.tags !== undefined) {
      updates.tags = Array.isArray(body.tags)
        ? body.tags.map((tag: unknown) => String(tag || "").trim()).filter(Boolean)
        : [];
    }

    if (body.name && body.name !== existing.name) {
      updates.slug = await generateUniqueSlug(body.name, id);
    }

    const updated = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: serializeProduct(updated!) });
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update item" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
