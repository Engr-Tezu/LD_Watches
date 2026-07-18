"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Watch } from "@/types/watch";
import AdminWatchList from "./AdminWatchList";
import AdminAddWatchModal from "./AdminAddWatchModal";

interface AdminWatchesClientProps {
  watches: Watch[];
}

export default function AdminWatchesClient({ watches }: AdminWatchesClientProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Watches</h1>
            <p className="text-ld-silver text-sm mt-1">
              {watches.length} {watches.length === 1 ? "watch" : "watches"} in collection
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-gold text-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Watch
          </button>
        </div>

        <div className="card-surface p-4 sm:p-6">
          <AdminWatchList watches={watches} onAddWatch={() => setShowAddModal(true)} />
        </div>
      </div>

      <AdminAddWatchModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </>
  );
}
