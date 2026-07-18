import { notFound } from "next/navigation";
import WatchForm from "@/components/admin/WatchForm";
import { connectDB } from "@/lib/mongodb";
import Watch from "@/models/Watch";
import { Watch as WatchType } from "@/types/watch";

interface EditWatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWatchPage({ params }: EditWatchPageProps) {
  const { id } = await params;

  let watch: WatchType | null = null;

  try {
    await connectDB();
    const doc = await Watch.findById(id).lean();
    if (doc) {
      watch = {
        ...doc,
        _id: String(doc._id),
        mainImageIndex: doc.mainImageIndex ?? 0,
        waterResistant: doc.waterResistant ?? Boolean(doc.specifications?.waterResistance),
        createdAt: doc.createdAt?.toISOString?.() ?? String(doc.createdAt),
        updatedAt: doc.updatedAt?.toISOString?.() ?? String(doc.updatedAt),
      } as WatchType;
    }
  } catch {
    watch = null;
  }

  if (!watch) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Watch</h1>
        <p className="text-ld-silver text-sm mt-1">Update details for {watch.name}</p>
      </div>

      <div className="bg-ld-charcoal rounded-xl border border-ld-grey/50 p-6 md:p-8">
        <WatchForm initialData={watch} isEditing />
      </div>
    </div>
  );
}
