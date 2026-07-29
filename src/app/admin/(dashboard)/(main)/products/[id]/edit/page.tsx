import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { Product as ProductType } from "@/types/product";
import { getCategories } from "@/lib/site";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  let product: ProductType | null = null;

  try {
    await connectDB();
    const doc = await Product.findById(id).lean();
    if (doc) {
      product = {
        ...doc,
        _id: String(doc._id),
        mainImageIndex: doc.mainImageIndex ?? 0,
        waterResistant:
          doc.waterResistant ?? Boolean(doc.specifications?.waterResistance),
        features: Array.isArray(doc.features) ? doc.features : [],
        tags: Array.isArray(doc.tags) ? doc.tags : [],
        createdAt: doc.createdAt?.toISOString?.() ?? String(doc.createdAt),
        updatedAt: doc.updatedAt?.toISOString?.() ?? String(doc.updatedAt),
      } as ProductType;
    }
  } catch {
    product = null;
  }

  if (!product) notFound();

  const categories = await getCategories().catch(() => []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Product</h1>
      </div>
      <div className="bg-ld-charcoal rounded-xl border border-ld-grey/50 p-6 md:p-8">
        <ProductForm initialData={product} categories={categories} isEditing />
      </div>
    </div>
  );
}
