"use client";

import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { WATCH_CATEGORIES, WatchFormData, Watch } from "@/types/watch";
import { Upload, X, Loader2, Star } from "lucide-react";

interface WatchFormProps {
  initialData?: Watch;
  isEditing?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const defaultFormData: WatchFormData = {
  name: "",
  description: "",
  price: 0,
  category: "Luxury",
  brand: "",
  images: [],
  mainImageIndex: 0,
  waterResistant: false,
  inStock: true,
  featured: false,
};

export default function WatchForm({
  initialData,
  isEditing = false,
  onSuccess,
  onCancel,
}: WatchFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<WatchFormData>(
    initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          price: initialData.price,
          category: initialData.category,
          brand: initialData.brand,
          images: initialData.images,
          mainImageIndex: initialData.mainImageIndex ?? 0,
          waterResistant:
            initialData.waterResistant ??
            Boolean(initialData.specifications?.waterResistance),
          inStock: initialData.inStock,
          featured: initialData.featured,
        }
      : defaultFormData
  );
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

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, data.data.url],
        }));
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
      if (index === prev.mainImageIndex) {
        newMainIndex = 0;
      } else if (index < prev.mainImageIndex) {
        newMainIndex = Math.max(0, prev.mainImageIndex - 1);
      }
      return {
        ...prev,
        images: newImages,
        mainImageIndex: newImages.length ? Math.min(newMainIndex, newImages.length - 1) : 0,
      };
    });
  };

  const setMainImage = (index: number) => {
    setFormData((prev) => ({ ...prev, mainImageIndex: index }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      ...formData,
      mainImageIndex: Math.min(
        formData.mainImageIndex,
        Math.max(0, formData.images.length - 1)
      ),
    };

    try {
      const url = isEditing ? `/api/watches/${initialData!._id}` : "/api/watches";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save watch");

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/watches");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 glass-panel rounded-xl text-white placeholder-ld-silver focus:outline-none focus:border-ld-gold/40 transition-colors";
  const labelClass = "block text-ld-light text-sm mb-2 font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label htmlFor="name" className={labelClass}>Watch Name *</label>
          <input id="name" name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="Rolex Submariner" />
        </div>
        <div>
          <label htmlFor="brand" className={labelClass}>Brand *</label>
          <input id="brand" name="brand" value={formData.brand} onChange={handleChange} required className={inputClass} placeholder="Rolex" />
        </div>
        <div>
          <label htmlFor="category" className={labelClass}>Category *</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} required className={inputClass}>
            {WATCH_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="price" className={labelClass}>Price (PKR) *</label>
          <input id="price" name="price" type="number" min="0" value={formData.price || ""} onChange={handleChange} required className={inputClass} placeholder="150000" />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>Description *</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} className={inputClass} placeholder="Describe the watch..." />
      </div>

      <div>
        <label className={labelClass}>Images</label>
        <p className="text-ld-silver text-xs mb-3">Click the star to set the main image shown in listings.</p>
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
                <Star className="w-3.5 h-3.5" fill={formData.mainImageIndex === index ? "currentColor" : "none"} />
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
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
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
          <input type="checkbox" name="waterResistant" checked={formData.waterResistant} onChange={handleChange} className="w-4 h-4 accent-ld-gold" />
          <span className="text-ld-light text-sm">Water Resistant</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="w-4 h-4 accent-ld-gold" />
          <span className="text-ld-light text-sm">In Stock</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 accent-ld-gold" />
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
        <button type="submit" disabled={submitting} className="btn-gold px-8 disabled:opacity-50 sm:ml-auto">
          {submitting ? "Saving..." : isEditing ? "Update Watch" : "Create Watch"}
        </button>
      </div>
    </form>
  );
}
