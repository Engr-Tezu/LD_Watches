import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getSiteSettings, upsertSiteSettings } from "@/lib/site";
import { SiteSettings } from "@/types/site";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

function pickDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const payload: Partial<SiteSettings> = {};

    const stringFields: Array<keyof SiteSettings> = [
      "siteName",
      "siteNameShort",
      "logoUrl",
      "contactPhone",
      "contactEmail",
      "contactAddress",
      "whatsappNumber",
      "siteUrl",
      "seoTitle",
      "seoDescription",
      "seoOgImage",
      "heroBadge",
      "heroTitlePrefix",
      "heroDescription",
      "collectionTitle",
      "collectionSubtitle",
      "aboutTitle",
      "aboutTagline",
      "faqPageTitle",
      "faqPageSubtitle",
      "faqImageUrl",
      "shippingPolicyTitle",
      "shippingPolicyContent",
      "returnPolicyTitle",
      "returnPolicyContent",
      "reviewsSectionTitle",
      "reviewsSectionSubtitle",
      "contactSectionTitle",
      "contactSectionDescription",
      "contactButtonLabel",
    ];

    for (const key of stringFields) {
      if (pickDefined(body[key])) {
        (payload as Record<string, unknown>)[key] = body[key];
      }
    }

    if (pickDefined(body.seoKeywords)) {
      payload.seoKeywords = Array.isArray(body.seoKeywords)
        ? body.seoKeywords
        : String(body.seoKeywords || "")
            .split(",")
            .map((word: string) => word.trim())
            .filter(Boolean);
    }

    if (pickDefined(body.heroRotatingWords)) {
      payload.heroRotatingWords = Array.isArray(body.heroRotatingWords)
        ? body.heroRotatingWords
        : String(body.heroRotatingWords || "")
            .split(",")
            .map((word: string) => word.trim())
            .filter(Boolean);
    }

    if (pickDefined(body.aboutBlocks)) {
      payload.aboutBlocks = body.aboutBlocks;
    }

    if (pickDefined(body.faqs)) {
      payload.faqs = body.faqs;
    }

    const settings = await upsertSiteSettings(payload);
    revalidatePath("/", "layout");
    revalidatePath("/faq");
    revalidatePath("/shipping-returns");
    revalidatePath("/products");
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json({ success: false, error: "Failed to save settings" }, { status: 500 });
  }
}
