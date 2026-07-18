import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Watch from "@/models/Watch";
import { getAdminSession } from "@/lib/auth";
import { generateUniqueSlug, serializeWatch, buildWatchLookupQuery } from "@/lib/watch-utils";
import { WATCH_CATEGORIES } from "@/types/watch";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    const watch = await Watch.findOne(buildWatchLookupQuery(id)).lean();

    if (!watch) {
      return NextResponse.json({ success: false, error: "Watch not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...watch,
        _id: String(watch._id),
        mainImageIndex: watch.mainImageIndex ?? 0,
        waterResistant: watch.waterResistant ?? false,
        createdAt: watch.createdAt?.toISOString?.() ?? watch.createdAt,
        updatedAt: watch.updatedAt?.toISOString?.() ?? watch.updatedAt,
      },
    });
  } catch (error) {
    console.error("GET /api/watches/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch watch" },
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

    const existing = await Watch.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Watch not found" }, { status: 404 });
    }

    if (body.category && !WATCH_CATEGORIES.includes(body.category)) {
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

    if (body.name && body.name !== existing.name) {
      updates.slug = await generateUniqueSlug(body.name, id);
    }

    const updated = await Watch.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: serializeWatch(updated!) });
  } catch (error) {
    console.error("PUT /api/watches/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update watch" },
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

    const deleted = await Watch.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Watch not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Watch deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/watches/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete watch" },
      { status: 500 }
    );
  }
}
