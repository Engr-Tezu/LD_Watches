import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getSiteSettings, upsertSiteSettings } from "@/lib/site";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const payload = {
      siteName: body.siteName,
      siteNameShort: body.siteNameShort,
      logoUrl: body.logoUrl,
      contactPhone: body.contactPhone,
      contactEmail: body.contactEmail,
      contactAddress: body.contactAddress,
      whatsappNumber: body.whatsappNumber,
      siteUrl: body.siteUrl,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      seoKeywords: Array.isArray(body.seoKeywords)
        ? body.seoKeywords
        : String(body.seoKeywords || "")
            .split(",")
            .map((word: string) => word.trim())
            .filter(Boolean),
      seoOgImage: body.seoOgImage,
      heroBadge: body.heroBadge,
      heroTitlePrefix: body.heroTitlePrefix,
      heroRotatingWords: Array.isArray(body.heroRotatingWords)
        ? body.heroRotatingWords
        : String(body.heroRotatingWords || "")
            .split(",")
            .map((word: string) => word.trim())
            .filter(Boolean),
      heroDescription: body.heroDescription,
      collectionTitle: body.collectionTitle,
      collectionSubtitle: body.collectionSubtitle,
      aboutTitle: body.aboutTitle,
      aboutBlocks: body.aboutBlocks,
      aboutTagline: body.aboutTagline,
      faqs: body.faqs,
      faqPageTitle: body.faqPageTitle,
      faqPageSubtitle: body.faqPageSubtitle,
      faqImageUrl: body.faqImageUrl || "",
      shippingPolicyTitle: body.shippingPolicyTitle,
      shippingPolicyContent: body.shippingPolicyContent,
      returnPolicyTitle: body.returnPolicyTitle,
      returnPolicyContent: body.returnPolicyContent,
      reviewsSectionTitle: body.reviewsSectionTitle,
      reviewsSectionSubtitle: body.reviewsSectionSubtitle,
      contactSectionTitle: body.contactSectionTitle,
      contactSectionDescription: body.contactSectionDescription,
      contactButtonLabel: body.contactButtonLabel,
    };

    const settings = await upsertSiteSettings(payload);
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json({ success: false, error: "Failed to save settings" }, { status: 500 });
  }
}
