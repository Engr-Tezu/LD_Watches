"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { FaqItem, SiteSettings } from "@/types/site";

const inputClass =
  "w-full px-4 py-3 glass-panel rounded-xl text-white placeholder-ld-silver focus:outline-none focus:border-ld-gold/40 transition-colors text-sm";

export default function AdminFaqsManager({ initialSettings }: { initialSettings: SiteSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [faqs, setFaqs] = useState<FaqItem[]>(Array.isArray(initialSettings.faqs) ? initialSettings.faqs : []);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return faqs.map((faq, index) => ({ faq, index }));
    return faqs
      .map((faq, index) => ({ faq, index }))
      .filter(
        ({ faq }) =>
          faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)
      );
  }, [faqs, search]);

  const persist = async (nextFaqs: FaqItem[], nextFaqImageUrl?: string) => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...settings,
        ...(typeof nextFaqImageUrl === "string" ? { faqImageUrl: nextFaqImageUrl } : {}),
        faqs: nextFaqs,
      };
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save FAQs");
      setSettings(data.data);
      setFaqs(Array.isArray(data.data.faqs) ? data.data.faqs : nextFaqs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save FAQs");
    } finally {
      setSaving(false);
    }
  };

  const uploadFaqImage = async (file: File) => {
    setUploadingImage(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "FAQ image upload failed");

      const url = data.data.url as string;
      await persist(faqs, url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "FAQ image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const addOrUpdate = async () => {
    const nextQ = question.trim();
    const nextA = answer.trim();
    if (!nextQ || !nextA) {
      setError("Question and answer are required");
      return;
    }

    if (editingIndex === null) {
      await persist([...faqs, { question: nextQ, answer: nextA }]);
    } else {
      const next = faqs.map((faq, idx) => (idx === editingIndex ? { question: nextQ, answer: nextA } : faq));
      await persist(next);
    }

    setEditingIndex(null);
    setQuestion("");
    setAnswer("");
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setQuestion(faqs[index]?.question || "");
    setAnswer(faqs[index]?.answer || "");
    setError("");
  };

  const remove = async () => {
    if (deleteIndex === null) return;
    const next = faqs.filter((_, idx) => idx !== deleteIndex);
    await persist(next);
    setDeleteIndex(null);
    if (editingIndex === deleteIndex) {
      setEditingIndex(null);
      setQuestion("");
      setAnswer("");
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    await persist(next);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ld-silver" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full pl-10 pr-4 py-3 glass-panel rounded-xl text-white placeholder-ld-silver focus:outline-none focus:border-ld-gold/40"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingIndex(null);
            setQuestion("");
            setAnswer("");
            setError("");
          }}
          className="btn-gold w-full lg:w-auto inline-flex items-center justify-center gap-2"
          disabled={saving}
        >
          <Plus className="w-4 h-4" />
          {editingIndex === null ? "Add FAQ" : "New FAQ"}
        </button>
      </div>

      <div className="card-surface p-5 sm:p-6 space-y-3">
        <h2 className="text-lg font-semibold text-white">FAQ Image</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-end">
          <div className="lg:col-span-2 space-y-2">
            <label className="block text-ld-light text-sm mb-2 font-medium">Image URL</label>
            <input
              value={settings.faqImageUrl || ""}
              onChange={(e) => setSettings((prev) => ({ ...prev, faqImageUrl: e.target.value }))}
              className={inputClass}
              placeholder="/home-watch.jfif"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-ld-light text-sm mb-2 font-medium">Upload</label>
            <input
              type="file"
              accept="image/*"
              disabled={uploadingImage || saving}
              onChange={(e) => e.target.files?.[0] && void uploadFaqImage(e.target.files[0])}
              className="block text-sm text-ld-light"
            />
            <p className="text-ld-silver text-xs">{uploadingImage ? "Uploading..." : "Or paste a URL above."}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => void persist(faqs, settings.faqImageUrl)}
            disabled={saving}
            className="btn-gold px-6 inline-flex items-center justify-center"
          >
            Save FAQ Image
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="card-surface p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-ld-light text-sm mb-2 font-medium">
              Question *
            </label>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={inputClass}
              placeholder="e.g. How long does shipping take?"
            />
          </div>
          <div>
            <label className="block text-ld-light text-sm mb-2 font-medium">
              Answer *
            </label>
            <textarea
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={inputClass}
              placeholder="Write the FAQ answer..."
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-end">
          <button
            type="button"
            onClick={() => {
              setEditingIndex(null);
              setQuestion("");
              setAnswer("");
              setError("");
            }}
            className="px-6 py-3 text-ld-silver hover:text-white transition-colors rounded-xl border border-ld-grey/40"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void addOrUpdate()}
            disabled={saving}
            className="btn-gold px-8 inline-flex items-center justify-center"
          >
            {saving ? "Saving..." : editingIndex === null ? "Add FAQ" : "Update FAQ"}
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="card-surface p-8 text-center text-ld-silver">No FAQs found.</div>
      ) : (
        <div className="space-y-3">
          {visible.map(({ faq, index }) => (
            <div key={`${faq.question}-${index}`} className="card-surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-white font-semibold text-sm truncate">
                    {faq.question}
                  </p>
                  <span className="text-[10px] uppercase tracking-wider text-ld-gold-light">
                    #{index + 1}
                  </span>
                </div>
                <p className="text-ld-silver text-sm leading-relaxed line-clamp-3">
                  {faq.answer}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => void move(index, -1)}
                  disabled={index === 0 || saving}
                  className="px-3 py-2 rounded-lg text-ld-silver hover:text-white hover:bg-white/5 disabled:opacity-40 transition-colors"
                  aria-label="Move up"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => void move(index, 1)}
                  disabled={index === faqs.length - 1 || saving}
                  className="px-3 py-2 rounded-lg text-ld-silver hover:text-white hover:bg-white/5 disabled:opacity-40 transition-colors"
                  aria-label="Move down"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(index)}
                  disabled={saving}
                  className="px-3 py-2 rounded-lg text-ld-gold border border-ld-gold/25 hover:bg-ld-gold/10 transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteIndex(index)}
                  disabled={saving}
                  className="px-3 py-2 rounded-lg text-red-400 border border-red-500/25 hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete FAQ?"
        message={
          deleteIndex !== null ? `Remove “${faqs[deleteIndex]?.question || ""}”?` : ""
        }
        confirmLabel="Delete"
        onConfirm={() => void remove()}
        onClose={() => setDeleteIndex(null)}
      />
    </div>
  );
}

