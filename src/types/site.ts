export interface AboutBlock {
  type: "heading" | "paragraph" | "card";
  /** Heading/paragraph body, or card title */
  text: string;
  /** Card description (ignored for heading/paragraph) */
  description?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteSettings {
  _id?: string;
  siteName: string;
  siteNameShort: string;
  logoUrl: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  whatsappNumber: string;
  siteUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  seoOgImage: string;
  heroBadge: string;
  heroTitlePrefix: string;
  heroRotatingWords: string[];
  heroDescription: string;
  collectionTitle: string;
  collectionSubtitle: string;
  aboutTitle: string;
  aboutBlocks: AboutBlock[];
  aboutTagline: string;
  faqs: FaqItem[];
  faqPageTitle: string;
  faqPageSubtitle: string;
  faqImageUrl: string;
  shippingPolicyTitle: string;
  shippingPolicyContent: string;
  returnPolicyTitle: string;
  returnPolicyContent: string;
  reviewsSectionTitle: string;
  reviewsSectionSubtitle: string;
  contactSectionTitle: string;
  contactSectionDescription: string;
  contactButtonLabel: string;
  /** @deprecated legacy about card fields kept for migration */
  aboutCardOneTitle?: string;
  aboutCardOneDescription?: string;
  aboutCardTwoTitle?: string;
  aboutCardTwoDescription?: string;
  aboutCardThreeTitle?: string;
  aboutCardThreeDescription?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  customerName: string;
  roleOrLocation: string;
  quote: string;
  rating: number;
  avatarUrl: string;
  sortOrder: number;
  isActive: boolean;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}
