import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReview extends Document {
  customerName: string;
  roleOrLocation: string;
  quote: string;
  rating: number;
  avatarUrl: string;
  sortOrder: number;
  isActive: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    customerName: { type: String, required: true, trim: true },
    roleOrLocation: { type: String, default: "", trim: true },
    quote: { type: String, required: true, trim: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    avatarUrl: { type: String, default: "", trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ReviewSchema.index({ isActive: 1, featured: 1, sortOrder: 1 });

if (mongoose.models.Review) {
  delete mongoose.models.Review;
}

const Review: Model<IReview> = mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
