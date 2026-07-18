export const WATCH_CATEGORIES = [
  "Luxury",
  "Sport",
  "Classic",
  "Smart",
  "Vintage",
  "Dress",
  "Diver",
] as const;

export type WatchCategory = (typeof WATCH_CATEGORIES)[number];

export interface Watch {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: WatchCategory;
  brand: string;
  images: string[];
  mainImageIndex: number;
  waterResistant: boolean;
  inStock: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  /** @deprecated legacy field */
  shortDescription?: string;
  /** @deprecated legacy field */
  originalPrice?: number;
  /** @deprecated legacy field */
  specifications?: Record<string, string>;
}

export interface WatchFormData {
  name: string;
  description: string;
  price: number;
  category: WatchCategory;
  brand: string;
  images: string[];
  mainImageIndex: number;
  waterResistant: boolean;
  inStock: boolean;
  featured: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
