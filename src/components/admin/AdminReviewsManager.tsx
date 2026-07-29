"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, Star, X } from "lucide-react";
import { Review } from "@/types/site";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CustomSelect from "@/components/ui/CustomSelect";
import ModalPortal from "@/components/ui/ModalPortal";

type ReviewForm = {
  customerName: string;
  roleOrLocation: string;
  quote: string;
  rating: string;
  sortOrder: string;
  isActive: boolean;
  featured: boolean;
};

const emptyForm: ReviewForm = {
  customerName: "",
  roleOrLocation: "",
  quote: "",
  rating: "5",
  sortOrder: "",
  isActive: true,
  featured: true,
};

const inputClass =
  "w-full px-4 py-3 glass-panel rounded-xl text-white placeholder-ld-silver focus:outline-none focus:border-ld-gold/40 transition-colors";

export default function AdminReviewsManager({
  initialReviews,
}: {
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [form, setForm] = useState<ReviewForm>(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reviews.filter((review) => {
      const matchesSearch =
        !query ||
        review.customerName.toLowerCase().includes(query) ||
        review.quote.toLowerCase().includes(query) ||
        review.roleOrLocation.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && review.isActive) ||
        (statusFilter === "hidden" && !review.isActive) ||
        (statusFilter === "featured" && review.featured);
      return matchesSearch && matchesStatus;
    });
  }, [reviews, search, statusFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (review: Review) => {
    setEditingId(review._id);
    setForm({
      customerName: review.customerName,
      roleOrLocation: review.roleOrLocation || "",
      quote: review.quote,
      rating: String(review.rating || 5),
      sortOrder: review.sortOrder ? String(review.sortOrder) : "",
      isActive: review.isActive,
      featured: review.featured,
    });
    setError("");
    setModalOpen(true);
  };

  const closeModal = (force = false) => {
    if (saving && !force) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        customerName: form.customerName.trim(),
        roleOrLocation: form.roleOrLocation.trim(),
        quote: form.quote.trim(),
        rating: Number(form.rating) || 5,
        sortOrder: form.sortOrder === "" ? 0 : Number(form.sortOrder),
        isActive: form.isActive,
        featured: form.featured,
      };

      if (!payload.customerName || !payload.quote) {
        throw new Error("Customer name and review text are required");
      }

      const res = await fetch(editingId ? `/api/reviews/${editingId}` : "/api/reviews", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save review");

      if (editingId) {
        setReviews((prev) =>
          prev
            .map((item) => (item._id === editingId ? data.data : item))
            .sort((a, b) => a.sortOrder - b.sortOrder)
        );
      } else {
        setReviews((prev) => [...prev, data.data].sort((a, b) => a.sortOrder - b.sortOrder));
      }
      closeModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/reviews/${deleteTarget._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete review");
      setReviews((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ld-silver" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="w-full pl-10 pr-4 py-3 glass-panel rounded-xl text-white placeholder-ld-silver focus:outline-none focus:border-ld-gold/40"
          />
        </div>
        <CustomSelect
          className="w-full lg:w-48"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "featured", label: "Featured" },
            { value: "hidden", label: "Hidden" },
          ]}
        />
        <button onClick={openCreate} className="btn-gold w-full lg:w-auto inline-flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Add Review
        </button>
      </div>

      {error && !modalOpen && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="card-surface p-8 text-center text-ld-silver">No reviews found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div
              key={review._id}
              className="card-surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                  <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {review.customerName}
                      </p>
                      {review.roleOrLocation && (
                        <p className="text-ld-silver text-xs truncate">
                          {review.roleOrLocation}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className={`w-3 h-3 ${
                              starIndex < review.rating
                                ? "text-ld-gold fill-ld-gold"
                                : "text-ld-grey"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-ld-gold-light text-xs font-medium">
                        {review.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-ld-light text-sm leading-relaxed">
                    “{review.quote}”
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        review.isActive
                          ? "border-green-500/30 text-green-400"
                          : "border-ld-grey/50 text-ld-silver"
                      }`}
                    >
                      {review.isActive ? "Active" : "Hidden"}
                    </span>
                    {review.featured && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-ld-gold/30 text-ld-gold-light">
                        Featured
                      </span>
                    )}
                  </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(review)}
                  className="px-3 py-2 rounded-lg text-sm text-ld-gold border border-ld-gold/25 hover:bg-ld-gold/10"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(review)}
                  className="px-3 py-2 rounded-lg text-sm text-red-400 border border-red-500/25 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete review?"
        message={
          deleteTarget
            ? `Remove the review from ${deleteTarget.customerName}?`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={remove}
        onClose={() => setDeleteTarget(null)}
      />

      <ModalPortal>
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70"
              onClick={() => closeModal()}
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-ld-grey/40 bg-ld-charcoal p-5 sm:p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">
                    {editingId ? "Edit Review" : "Add Review"}
                  </h2>
                  <button
                    onClick={() => closeModal()}
                    className="p-2 rounded-lg text-ld-silver hover:text-white hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-ld-light text-sm mb-2">Customer Name *</label>
                    <input
                      value={form.customerName}
                      onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))}
                      className={inputClass}
                      placeholder="Ayesha Khan"
                    />
                  </div>
                  <div>
                    <label className="block text-ld-light text-sm mb-2">Role / Location</label>
                    <input
                      value={form.roleOrLocation}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, roleOrLocation: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="Lahore, Pakistan"
                    />
                  </div>
                  <div>
                    <label className="block text-ld-light text-sm mb-2">Review *</label>
                    <textarea
                      rows={4}
                      value={form.quote}
                      onChange={(e) => setForm((prev) => ({ ...prev, quote: e.target.value }))}
                      className={inputClass}
                      placeholder="Write the customer testimonial..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-ld-light text-sm mb-2">Rating</label>
                      <CustomSelect
                        value={form.rating}
                        onChange={(value) => setForm((prev) => ({ ...prev, rating: value }))}
                        options={["5", "4", "3", "2", "1"].map((value) => ({
                          value,
                          label: `${value} Stars`,
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block text-ld-light text-sm mb-2">Sort Order</label>
                      <input
                        value={form.sortOrder}
                        onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
                        className={inputClass}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                        className="w-4 h-4 accent-ld-gold"
                      />
                      <span className="text-ld-light text-sm">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                        className="w-4 h-4 accent-ld-gold"
                      />
                      <span className="text-ld-light text-sm">Show on homepage</span>
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => closeModal()}
                    className="px-4 py-2 text-ld-silver hover:text-white text-sm"
                  >
                    Cancel
                  </button>
                  <button type="button" onClick={save} disabled={saving} className="btn-gold">
                    {saving ? "Saving..." : editingId ? "Update" : "Create"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ModalPortal>
    </div>
  );
}
