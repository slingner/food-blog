"use client";

import { useState } from "react";
import { X, Search, Check, ImageIcon } from "lucide-react";
import { MediaUploader } from "./MediaUploader";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
};

// Stub images for now
const stubImages = [
  { url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop", alt: "Bread" },
  { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", alt: "Pizza" },
  { url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop", alt: "Pancakes" },
  { url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop", alt: "Salad" },
  { url: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop", alt: "Pasta" },
  { url: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop", alt: "French toast" },
];

export function ImagePicker({ open, onClose, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<"library" | "upload">("library");

  if (!open) return null;

  const filtered = stubImages.filter((img) =>
    search ? img.alt.toLowerCase().includes(search.toLowerCase()) : true
  );

  function handleConfirm() {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[80vh] rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--admin-border)]">
          <h2 className="text-base font-semibold text-[var(--admin-text)]">
            Select Image
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-md text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface-raised)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-5 pt-4">
          <button
            onClick={() => setTab("library")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === "library"
                ? "bg-[var(--admin-surface-raised)] text-[var(--admin-text)]"
                : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)]"
            }`}
          >
            Library
          </button>
          <button
            onClick={() => setTab("upload")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === "upload"
                ? "bg-[var(--admin-surface-raised)] text-[var(--admin-text)]"
                : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)]"
            }`}
          >
            Upload New
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === "library" ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search images..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)] text-sm placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {filtered.map((img) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => setSelected(img.url)}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-colors ${
                      selected === img.url
                        ? "border-[var(--admin-accent)]"
                        : "border-transparent hover:border-[var(--admin-border-subtle)]"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                    {selected === img.url && (
                      <div className="absolute inset-0 bg-[var(--admin-accent)]/20 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-[var(--admin-accent)] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-[var(--admin-text-muted)]">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No images found</p>
                </div>
              )}
            </div>
          ) : (
            <MediaUploader
              onUpload={(url) => {
                onSelect(url);
                onClose();
              }}
            />
          )}
        </div>

        {/* Footer */}
        {tab === "library" && (
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[var(--admin-border)]">
            <button
              onClick={onClose}
              className="h-9 px-4 rounded-lg text-sm font-medium text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-raised)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selected}
              className="h-9 px-4 rounded-lg bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Select Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
