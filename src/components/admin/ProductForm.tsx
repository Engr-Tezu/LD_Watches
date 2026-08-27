"use client";

import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductFormData, Product } from "@/types/product";
import { Category } from "@/types/site";
import { Upload, X, Loader2, Star, Plus } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import { formatPrice } from "@/lib/utils";

function normalizeFeatureList(features: unknown): string[] {
  if (!Array.isArray(features)) return [];
  return features
    .map((feature) => {
      if (typeof feature === "string") return feature;
      if (feature && typeof feature === "object") {
        const record = feature as { label?: string; value?: string };
        const label = String(record.label || "").trim();
        const value = String(record.value || "").trim();
        if (label && value) return `${label}: ${value}`;
        return label || value;
      }
      return "";
    })
    .filter((feature) => typeof feature === "string");
}

interface ProductFormProps {
  initialData?: Product;
  categories: Category[];
  isEditing?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const defaultFormData: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  discountPercentage: 0,
  category: "",
  brand: "",
  images: [],
  mainImageIndex: 0,
  waterResistant: false,
  inStock: true,
  featured: false,
  features: [],
  tags: [],
};

const inputClass =
  "w-full px-4 py-3 glass-panel rounded-xl text-white placeholder-ld-silver focus:outline-none focus:border-ld-gold/40 transition-colors";
const labelClass = "block text-ld-light text-sm mb-2 font-medium";

export default function ProductForm({
  initialData,
  categories,
  isEditing = false,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProductFormData>(
    initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          price: initialData.price,
          discountPercentage: initialData.discountPercentage ?? 0,
          category: initialData.category,
          brand: initialData.brand,
          images: initialData.images,
          mainImageIndex: initialData.mainImageIndex ?? 0,
          waterResistant:
            initialData.waterResistant ??
            Boolean(initialData.specifications?.waterResistance),
          inStock: initialData.inStock,
          featured: initialData.featured,
          features: normalizeFeatureList(initialData.features),
          tags: Array.isArray(initialData.tags)
            ? initialData.tags.map((tag) => String(tag || "").trim()).filter(Boolean)
            : [],
        }
      : { ...defaultFormData, category: categories[0]?.name || "" }
  );
  // Mirrors getProductPricing() so the admin sees exactly what the site will show.
  const discountPercent = Math.min(95, Math.max(0, Number(formData.discountPercentage) || 0));
  const discountedPrice =
    discountPercent > 0 && formData.price > 0
      ? Math.round(formData.price * (1 - discountPercent / 100))
      : null;

  const [featureInput, setFeatureInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formDataUpload });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setFormData((prev) => ({ ...prev, images: [...prev.images, data.data.url] }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      let newMainIndex = prev.mainImageIndex;
      if (index === prev.mainImageIndex) newMainIndex = 0;
      else if (index < prev.mainImageIndex) newMainIndex = Math.max(0, prev.mainImageIndex - 1);
      return {
        ...prev,
        images: newImages,
        mainImageIndex: newImages.length ? Math.min(newMainIndex, newImages.length - 1) : 0,
      };
    });
  };

  const setMainImage = (index: number) =>
    setFormData((prev) => ({ ...prev, mainImageIndex: index }));

  const addFeature = () => {
    const value = featureInput.trim();
    if (!value) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, value],
    }));
    setFeatureInput("");
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    if (formData.tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) {
      setTagInput("");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, value],
    }));
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (!formData.category) {
      setError("Please select a category");
      setSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      discountPercentage: Math.min(95, Math.max(0, Number(formData.discountPercentage) || 0)),
      mainImageIndex: Math.min(
        formData.mainImageIndex,
        Math.max(0, formData.images.length - 1)
      ),
      features: formData.features.map((feature) => feature.trim()).filter(Boolean),
      tags: formData.tags.map((tag) => tag.trim()).filter(Boolean),
    };

    try {
      const url = isEditing ? `/api/products/${initialData!._id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save item");
      if (onSuccess) onSuccess();
      else router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label htmlFor="name" className={labelClass}>
            Product Name *
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="Premium Product"
          />
        </div>
        <div>
          <label htmlFor="brand" className={labelClass}>
            Brand *
          </label>
          <input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="Brand Name"
          />
        </div>
        <div>
          <label htmlFor="category" className={labelClass}>
            Category *
          </label>
          <CustomSelect
            value={formData.category}
            onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            options={categories.map((cat) => ({ value: cat.name, label: cat.name }))}
            placeholder="Select category"
          />
        </div>
        <div>
          <label htmlFor="price" className={labelClass}>
            Price (PKR) *
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            value={formData.price || ""}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="150000"
          />
        </div>
        <div>
          <label htmlFor="discountPercentage" className={labelClass}>
            Discount (%)
          </label>
          <input
            id="discountPercentage"
            name="discountPercentage"
            type="number"
            min="0"
            max="95"
            value={formData.discountPercentage || ""}
            onChange={handleChange}
            className={inputClass}
            placeholder="0"
          />
          {discountedPrice !== null ? (
            <p className="mt-2 text-xs text-ld-gold-light">
              Customers pay{" "}
              <span className="font-semibold">{formatPrice(discountedPrice)}</span> — the
              regular price {formatPrice(formData.price)} is shown crossed out.
            </p>
          ) : (
            <p className="mt-2 text-xs text-ld-silver">
              Leave at 0 for no discount. Otherwise the sale price is calculated from the price
              above.
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className={inputClass}
          placeholder="Describe the product..."
        />
      </div>

      <div>
        <label className={labelClass}>Tags</label>
        <p className="text-ld-silver text-xs mb-2">
          Shown next to brand on product cards and detail pages.
        </p>
        <div className="flex gap-3">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            className={inputClass}
            placeholder="e.g. Limited Edition, New Arrival"
          />
          <button
            type="button"
            onClick={addTag}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-ld-gold/15 text-ld-gold border border-ld-gold/25 hover:bg-ld-gold/25 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {formData.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border border-ld-gold/25 bg-ld-gold/15 text-ld-gold-light"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="p-0.5 rounded-full hover:bg-red-500/20 text-red-400 transition-colors"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>Features</label>
        <div className="flex gap-3">
          <input
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFeature();
              }
            }}
            className={inputClass}
            placeholder="e.g. Genuine leather, water resistant up to 50m"
          />
          <button
            type="button"
            onClick={addFeature}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-ld-gold/15 text-ld-gold border border-ld-gold/25 hover:bg-ld-gold/25 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {formData.features.length > 0 && (
          <ul className="mt-3 space-y-2">
            {formData.features.map((feature, index) => (
              <li
                key={`${feature}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-ld-grey/40 bg-ld-dark/60 px-4 py-3"
              >
                <span className="text-sm text-ld-light">{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                  aria-label="Remove feature"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className={labelClass}>Images</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {formData.images.map((img, index) => (
            <div
              key={index}
              className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden group ${
                formData.mainImageIndex === index
                  ? "ring-2 ring-ld-gold ring-offset-2 ring-offset-ld-charcoal"
                  : "border border-ld-grey/50"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="112px" />
              <button
                type="button"
                onClick={() => setMainImage(index)}
                className={`absolute top-1 left-1 p-1 rounded-full transition-colors ${
                  formData.mainImageIndex === index
                    ? "bg-ld-gold text-[#1a1200]"
                    : "bg-black/60 text-white hover:bg-ld-gold hover:text-[#1a1200]"
                }`}
                title="Set as main image"
              >
                <Star
                  className="w-3.5 h-3.5"
                  fill={formData.mainImageIndex === index ? "currentColor" : "none"}
                />
              </button>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
              {formData.mainImageIndex === index && (
                <span className="absolute bottom-0 inset-x-0 bg-ld-gold/90 text-[#1a1200] text-[10px] font-bold text-center py-0.5">
                  MAIN
                </span>
              )}
            </div>
          ))}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 glass-panel rounded-xl text-ld-light hover:text-ld-gold transition-colors disabled:opacity-50 text-sm"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-5 sm:gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="waterResistant"
            checked={formData.waterResistant}
            onChange={handleChange}
            className="w-4 h-4 accent-ld-gold"
          />
          <span className="text-ld-light text-sm">Water Resistant</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
            className="w-4 h-4 accent-ld-gold"
          />
          <span className="text-ld-light text-sm">In Stock</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 accent-ld-gold"
          />
          <span className="text-ld-light text-sm">Featured</span>
        </label>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-ld-grey/50">
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : router.back())}
          className="px-6 py-3 text-ld-silver hover:text-white transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="btn-gold px-8 disabled:opacity-50 sm:ml-auto"
        >
          {submitting ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
