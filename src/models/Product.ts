import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  images: string[];
  mainImageIndex: number;
  waterResistant: boolean;
  inStock: boolean;
  featured: boolean;
  features: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  shortDescription?: string;
  originalPrice?: number;
  specifications?: Record<string, string>;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    mainImageIndex: { type: Number, default: 0, min: 0 },
    waterResistant: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    features: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    shortDescription: { type: String, default: "" },
    originalPrice: { type: Number, min: 0 },
    specifications: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, collection: "watches" }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ name: "text", brand: "text", description: "text" });

if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
