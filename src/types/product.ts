export type ProductCategory = string;

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: ProductCategory;
  brand: string;
  images: string[];
  mainImageIndex: number;
  waterResistant: boolean;
  inStock: boolean;
  featured: boolean;
  features: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  shortDescription?: string;
  originalPrice?: number;
  /** Marketing discount in percent (0–95). Drives the sale price shown on site. */
  discountPercentage?: number;
  specifications?: Record<string, string>;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  category: ProductCategory;
  brand: string;
  images: string[];
  mainImageIndex: number;
  waterResistant: boolean;
  inStock: boolean;
  featured: boolean;
  features: string[];
  tags: string[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
