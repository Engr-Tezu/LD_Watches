import mongoose, { Schema, Document, Model } from "mongoose";
import { WatchCategory } from "@/types/watch";

export interface IWatch extends Document {
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
  createdAt: Date;
  updatedAt: Date;
  shortDescription?: string;
  originalPrice?: number;
  specifications?: Record<string, string>;
}

const WatchSchema = new Schema<IWatch>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Luxury", "Sport", "Classic", "Smart", "Vintage", "Dress", "Diver"],
    },
    brand: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    mainImageIndex: { type: Number, default: 0, min: 0 },
    waterResistant: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    shortDescription: { type: String, default: "" },
    originalPrice: { type: Number, min: 0 },
    specifications: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

WatchSchema.index({ category: 1 });
WatchSchema.index({ featured: 1 });
WatchSchema.index({ name: "text", brand: "text", description: "text" });

const Watch: Model<IWatch> =
  mongoose.models.Watch || mongoose.model<IWatch>("Watch", WatchSchema);

export default Watch;
