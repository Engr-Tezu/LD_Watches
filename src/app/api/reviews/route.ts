import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import ReviewModel from "@/models/Review";
import { getReviews } from "@/lib/site";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    const featuredOnly = searchParams.get("featured") === "true";
    const reviews = await getReviews({ activeOnly, featuredOnly });
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
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
    const customerName = String(body.customerName || "").trim();
    const quote = String(body.quote || "").trim();
    const roleOrLocation = String(body.roleOrLocation || "").trim();
    const avatarUrl = String(body.avatarUrl || "").trim();
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    const sortOrder =
      body.sortOrder === "" || body.sortOrder === null || body.sortOrder === undefined
        ? 0
        : Number(body.sortOrder);
    const isActive = body.isActive !== false;
    const featured = body.featured !== false;

    if (!customerName || !quote) {
      return NextResponse.json(
        { success: false, error: "Customer name and review text are required" },
        { status: 400 }
      );
    }

    const review = await ReviewModel.create({
      customerName,
      quote,
      roleOrLocation,
      avatarUrl,
      rating,
      sortOrder,
      isActive,
      featured,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...review.toObject(),
          _id: String(review._id),
          createdAt: review.createdAt?.toISOString?.() ?? review.createdAt,
          updatedAt: review.updatedAt?.toISOString?.() ?? review.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ success: false, error: "Failed to create review" }, { status: 500 });
  }
}
