"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, X } from "lucide-react";
import { Category } from "@/types/site";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CustomSelect from "@/components/ui/CustomSelect";
import ModalPortal from "@/components/ui/ModalPortal";

type CategoryForm = {
  name: string;
  description: string;
  sortOrder: string;
  isActive: boolean;
};

const emptyForm: CategoryForm = {
  name: "",
  description: "",
  sortOrder: "",
  isActive: true,
};

const inputClass =
  "w-full px-4 py-3 glass-panel rounded-xl text-white placeholder-ld-silver focus:outline-none focus:border-ld-gold/40 transition-colors";

export default function AdminCategoriesManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
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
    return categories.filter((category) => {
      const matchesSearch =
        !query ||
        category.name.toLowerCase().includes(query) ||
        (category.description || "").toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && category.isActive) ||
        (statusFilter === "hidden" && !category.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingId(category._id);
    setForm({
      name: category.name,
      description: category.description || "",
      sortOrder: category.sortOrder ? String(category.sortOrder) : "",
      isActive: category.isActive,
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
        name: form.name.trim(),
        description: form.description.trim(),
        sortOrder: form.sortOrder === "" ? 0 : Number(form.sortOrder),
        isActive: form.isActive,
      };

      if (!payload.name) {
        throw new Error("Category name is required");
      }

      const res = await fetch(editingId ? `/api/categories/${editingId}` : "/api/categories", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category");

      if (editingId) {
        setCategories((prev) =>
          prev
            .map((item) => (item._id === editingId ? data.data : item))
            .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
        );
      } else {
        setCategories((prev) =>
          [...prev, data.data].sort(
            (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)
          )
        );
      }

      closeModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/categories/${deleteTarget._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete category");
      setCategories((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
    }
  };

  return (
    <div className="space-y-5">
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Category"
        message={
          deleteTarget
            ? `Delete "${deleteTarget.name}"? Products already using this category keep their saved value.`
            : ""
        }
        confirmLabel="Delete"
        onClose={() => setDeleteTarget(null)}
        onConfirm={remove}
      />

      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ld-silver" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-3 glass-panel rounded-xl text-white placeholder-ld-silver focus:outline-none focus:border-ld-gold/40"
          />
        </div>
        <CustomSelect
          className="w-full lg:w-48"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "hidden", label: "Hidden" },
          ]}
        />
        <button onClick={openCreate} className="btn-gold w-full lg:w-auto">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {error && !modalOpen && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="card-surface p-4 sm:p-6">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-ld-light mb-4">
              {categories.length === 0 ? "No categories yet" : "No categories match your filters"}
            </p>
            {categories.length === 0 && (
              <button onClick={openCreate} className="btn-gold text-sm">
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((category) => (
              <div
                key={category._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-ld-dark rounded-xl border border-ld-grey/40"
              >
                <div className="min-w-0">
                  <p className="text-white font-medium">{category.name}</p>
                  {category.description ? (
                    <p className="text-ld-silver text-sm mt-1 line-clamp-2">{category.description}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span
                    className={`px-2 py-1 rounded ${
                      category.isActive
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {category.isActive ? "Active" : "Hidden"}
                  </span>
                  <button
                    onClick={() => openEdit(category)}
                    className="px-3 py-2 rounded-lg text-ld-gold hover:bg-ld-gold/10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(category)}
                    className="px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ModalPortal>
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => closeModal()}
                aria-label="Close"
              />
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-ld-gold/20 bg-ld-charcoal shadow-2xl"
              >
                <div className="flex items-center justify-between gap-3 border-b border-ld-grey/50 px-5 py-4">
                  <h2 className="text-lg font-bold text-white">
                    {editingId ? "Edit Category" : "Add Category"}
                  </h2>
                  <button
                    onClick={() => closeModal()}
                    className="p-2 rounded-lg text-ld-silver hover:text-white hover:bg-ld-grey/50"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-ld-light text-sm mb-2">Name *</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      className={inputClass}
                      placeholder="Shoes"
                    />
                  </div>

                  <div>
                    <label className="block text-ld-light text-sm mb-2">Description</label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, description: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label className="block text-ld-light text-sm mb-2">Sort Order</label>
                    <input
                      type="number"
                      value={form.sortOrder}
                      onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
                      className={inputClass}
                      placeholder="Optional"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-ld-light">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                      }
                      className="w-4 h-4 accent-ld-gold"
                    />
                    Active
                  </label>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-ld-grey/50 px-5 py-4">
                  <button
                    type="button"
                    onClick={() => closeModal()}
                    className="px-5 py-2.5 rounded-lg text-ld-silver hover:text-white"
                  >
                    Cancel
                  </button>
                  <button type="button" onClick={save} disabled={saving} className="btn-gold">
                    {saving ? "Saving..." : editingId ? "Update" : "Create"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </ModalPortal>
    </div>
  );
}
