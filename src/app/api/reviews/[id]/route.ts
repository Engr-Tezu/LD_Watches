import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import ReviewModel from "@/models/Review";

interface RouteParams {
  params: Promise<{ id: string }>;
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

    const updates: Record<string, unknown> = {};
    if (body.customerName !== undefined) updates.customerName = String(body.customerName).trim();
    if (body.quote !== undefined) updates.quote = String(body.quote).trim();
    if (body.roleOrLocation !== undefined) {
      updates.roleOrLocation = String(body.roleOrLocation).trim();
    }
    if (body.avatarUrl !== undefined) updates.avatarUrl = String(body.avatarUrl).trim();
    if (body.rating !== undefined) {
      updates.rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    }
    if (body.sortOrder !== undefined) {
      updates.sortOrder =
        body.sortOrder === "" || body.sortOrder === null ? 0 : Number(body.sortOrder);
    }
    if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive);
    if (body.featured !== undefined) updates.featured = Boolean(body.featured);

    if (!updates.customerName && body.customerName !== undefined) {
      return NextResponse.json({ success: false, error: "Customer name is required" }, { status: 400 });
    }
    if (!updates.quote && body.quote !== undefined) {
      return NextResponse.json({ success: false, error: "Review text is required" }, { status: 400 });
    }

    const review = await ReviewModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...review.toObject(),
        _id: String(review._id),
        createdAt: review.createdAt?.toISOString?.() ?? review.createdAt,
        updatedAt: review.updatedAt?.toISOString?.() ?? review.updatedAt,
      },
    });
  } catch (error) {
    console.error("PUT /api/reviews/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update review" }, { status: 500 });
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
    const review = await ReviewModel.findByIdAndDelete(id);
    if (!review) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("DELETE /api/reviews/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete review" }, { status: 500 });
  }
}
