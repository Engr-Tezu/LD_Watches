import { getWatches } from "@/lib/data";
import { Watch } from "@/types/watch";
import AdminWatchesClient from "@/components/admin/AdminWatchesClient";

export default async function AdminWatchesPage() {
  let watches: Watch[] = [];

  try {
    watches = await getWatches();
  } catch {
    watches = [];
  }

  return <AdminWatchesClient watches={watches} />;
}
