import React, { useEffect, useMemo, useState } from "react";
import { X, Plus, Pencil } from "lucide-react";
import Button from "./ui/Button";
import { cn } from "@/lib/utils";

const emptyForm = {
  title: "",
  summary: "",
  authorsText: "",
  keywordsText: "",
  resourceType: "",
  publishedAt: "",
  size: "",
  cover: "",
  source: "",
};

function toTextArray(value) {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function listToText(value) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string") return value;
  return "";
}

export default function MaterialFormModal({
  open,
  mode = "add", 
  initialMaterial = null,
  onClose,
  onSubmit,
}) {
  const isEdit = mode === "edit";

  const initial = useMemo(() => {
    if (!initialMaterial) return emptyForm;

    return {
      title: initialMaterial.title || "",
      summary: initialMaterial.summary || "",
      authorsText: listToText(initialMaterial.authors),
      keywordsText: listToText(initialMaterial.keywords),
      resourceType: initialMaterial.resourceType || "",
      publishedAt: initialMaterial.publishedAt || "",
      size: initialMaterial.size || "",
      cover: initialMaterial.cover || "",
      source: initialMaterial.source || "",
    };
  }, [initialMaterial]);

  const [form, setForm] = useState(initial);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(initial);
    setTouched(false);
  }, [open, initial]);

  if (!open) return null;

  const titleError = touched && !form.title.trim();
  const sourceError = touched && !form.source.trim();

  const handleChange = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);

    if (!form.title.trim() || !form.source.trim()) return;

    const payload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      authors: toTextArray(form.authorsText),
      keywords: toTextArray(form.keywordsText),
      resourceType: form.resourceType.trim(),
      publishedAt: form.publishedAt.trim(),
      size: form.size.trim(),
      cover: form.cover.trim(),
      source: form.source.trim(),
    };

    onSubmit?.(payload);
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            "w-full max-w-2xl rounded-3xl border border-border",
            "bg-background/95 backdrop-blur-xl shadow-2xl",
            "overflow-hidden"
          )}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center">
                {isEdit ? (
                  <Pencil size={18} className="text-primary" />
                ) : (
                  <Plus size={18} className="text-primary" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {isEdit ? "Materialni tahrirlash" : "Yangi material qo'shish"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Title va Link (source) majburiy.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
              aria-label="Close"
            >
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Sarlavha (title) *
                </label>
                <input
                  value={form.title}
                  onChange={handleChange("title")}
                  className={cn(
                    "w-full px-4 py-3 rounded-2xl",
                    "bg-secondary/50 border-2",
                    titleError ? "border-red-500/60" : "border-transparent",
                    "text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:border-primary focus:bg-background",
                    "transition-all duration-300"
                  )}
                  placeholder="Masalan: Chizmachilik darsligi"
                />
                {titleError && (
                  <p className="text-xs text-red-500 mt-2">Sarlavha majburiy.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Resurs turi
                </label>
                <input
                  value={form.resourceType}
                  onChange={handleChange("resourceType")}
                  className={cn(
                    "w-full px-4 py-3 rounded-2xl",
                    "bg-secondary/50 border-2 border-transparent",
                    "text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:border-primary focus:bg-background",
                    "transition-all duration-300"
                  )}
                  placeholder="Masalan: Darslik / Qo'llanma"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Qisqacha izoh (summary)
              </label>
              <textarea
                value={form.summary}
                onChange={handleChange("summary")}
                rows={4}
                className={cn(
                  "w-full px-4 py-3 rounded-2xl",
                  "bg-secondary/50 border-2 border-transparent",
                  "text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:border-primary focus:bg-background",
                  "transition-all duration-300 resize-none"
                )}
                placeholder="Qisqacha tavsif..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Mualliflar (vergul bilan)
                </label>
                <input
                  value={form.authorsText}
                  onChange={handleChange("authorsText")}
                  className={cn(
                    "w-full px-4 py-3 rounded-2xl",
                    "bg-secondary/50 border-2 border-transparent",
                    "text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:border-primary focus:bg-background",
                    "transition-all duration-300"
                  )}
                  placeholder="Masalan: Ali, Vali"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Kalit so'zlar (vergul bilan)
                </label>
                <input
                  value={form.keywordsText}
                  onChange={handleChange("keywordsText")}
                  className={cn(
                    "w-full px-4 py-3 rounded-2xl",
                    "bg-secondary/50 border-2 border-transparent",
                    "text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:border-primary focus:bg-background",
                    "transition-all duration-300"
                  )}
                  placeholder="Masalan: proyeksiya, chizma"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Sana (publishedAt)
                </label>
                <input
                  value={form.publishedAt}
                  onChange={handleChange("publishedAt")}
                  className={cn(
                    "w-full px-4 py-3 rounded-2xl",
                    "bg-secondary/50 border-2 border-transparent",
                    "text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:border-primary focus:bg-background",
                    "transition-all duration-300"
                  )}
                  placeholder="Masalan: 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Bet soni (size)
                </label>
                <input
                  value={form.size}
                  onChange={handleChange("size")}
                  className={cn(
                    "w-full px-4 py-3 rounded-2xl",
                    "bg-secondary/50 border-2 border-transparent",
                    "text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:border-primary focus:bg-background",
                    "transition-all duration-300"
                  )}
                  placeholder="Masalan: 120"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Cover rasm URL
                </label>
                <input
                  value={form.cover}
                  onChange={handleChange("cover")}
                  className={cn(
                    "w-full px-4 py-3 rounded-2xl",
                    "bg-secondary/50 border-2 border-transparent",
                    "text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:border-primary focus:bg-background",
                    "transition-all duration-300"
                  )}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Link (source) *
                </label>
                <input
                  value={form.source}
                  onChange={handleChange("source")}
                  className={cn(
                    "w-full px-4 py-3 rounded-2xl",
                    "bg-secondary/50 border-2",
                    sourceError ? "border-red-500/60" : "border-transparent",
                    "text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:border-primary focus:bg-background",
                    "transition-all duration-300"
                  )}
                  placeholder="https://..."
                />
                {sourceError && (
                  <p className="text-xs text-red-500 mt-2">Link majburiy.</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                Bekor qilish
              </Button>
              <Button type="submit">
                {isEdit ? "Saqlash" : "Qo'shish"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
