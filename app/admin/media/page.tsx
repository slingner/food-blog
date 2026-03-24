"use client";

import { useState } from "react";
import { Search, Trash2, Copy, Check, ImageIcon, Grid3X3, List } from "lucide-react";
import { MediaUploader } from "@/components/admin/MediaUploader";

type MediaItem = {
  id: number;
  url: string;
  name: string;
  size: string;
  uploadedAt: Date;
};

const stubMedia: MediaItem[] = [
  { id: 1, url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop", name: "sourdough-bread.jpg", size: "1.2 MB", uploadedAt: new Date("2025-03-15") },
  { id: 2, url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", name: "pizza-margherita.jpg", size: "890 KB", uploadedAt: new Date("2025-03-14") },
  { id: 3, url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop", name: "pancakes-stack.jpg", size: "1.5 MB", uploadedAt: new Date("2025-03-13") },
  { id: 4, url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop", name: "fresh-salad.jpg", size: "780 KB", uploadedAt: new Date("2025-03-12") },
  { id: 5, url: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop", name: "pasta-bolognese.jpg", size: "1.1 MB", uploadedAt: new Date("2025-03-11") },
  { id: 6, url: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop", name: "french-toast.jpg", size: "920 KB", uploadedAt: new Date("2025-03-10") },
];

export default function MediaLibraryPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [copied, setCopied] = useState<number | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const filtered = stubMedia.filter((m) =>
    search ? m.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  const copyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopied(item.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleSelect = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--admin-text)] tracking-tight">
          Media Library
        </h1>
        <p className="text-sm text-[var(--admin-text-muted)] mt-1">
          Upload and manage images
        </p>
      </div>

      {/* Upload area */}
      <MediaUploader onUpload={(url) => console.log("Uploaded:", url)} />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[var(--admin-surface)] border border-[var(--admin-border)] text-[var(--admin-text)] text-sm placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40"
          />
        </div>

        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button className="flex items-center gap-2 h-8 px-3 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
              Delete ({selected.size})
            </button>
          )}
          <div className="flex items-center gap-0.5 p-0.5 rounded-md bg-[var(--admin-surface)]">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded transition-colors ${
                view === "grid"
                  ? "bg-[var(--admin-surface-raised)] text-[var(--admin-text)]"
                  : "text-[var(--admin-text-muted)]"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded transition-colors ${
                view === "list"
                  ? "bg-[var(--admin-surface-raised)] text-[var(--admin-text)]"
                  : "text-[var(--admin-text-muted)]"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid view */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`group relative rounded-xl overflow-hidden border transition-colors cursor-pointer ${
                selected.has(item.id)
                  ? "border-[var(--admin-accent)] ring-2 ring-[var(--admin-accent)]/30"
                  : "border-[var(--admin-border)] hover:border-[var(--admin-border-subtle)]"
              }`}
              onClick={() => toggleSelect(item.id)}
            >
              <div className="aspect-[4/3]">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-white font-medium truncate">
                  {item.name}
                </p>
                <p className="text-[10px] text-white/60">{item.size}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyUrl(item);
                  }}
                  className="flex items-center justify-center w-7 h-7 rounded-md bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  {copied === item.id ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {selected.has(item.id) && (
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[var(--admin-accent)] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--admin-border)]">
                <th className="w-10 px-3 py-3" />
                <th className="text-left text-xs font-medium text-[var(--admin-text-muted)] uppercase tracking-wider px-3 py-3">
                  File
                </th>
                <th className="text-left text-xs font-medium text-[var(--admin-text-muted)] uppercase tracking-wider px-3 py-3 hidden sm:table-cell">
                  Size
                </th>
                <th className="w-20 px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[var(--admin-surface-raised)]/50 transition-colors"
                >
                  <td className="px-3 py-2.5">
                    <div className="w-10 h-10 rounded-md overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="text-sm text-[var(--admin-text)] font-mono">
                      {item.name}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 hidden sm:table-cell">
                    <span className="text-sm text-[var(--admin-text-muted)]">
                      {item.size}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyUrl(item)}
                        className="p-1.5 rounded text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface-raised)] transition-colors"
                      >
                        {copied === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button className="p-1.5 rounded text-[var(--admin-text-muted)] hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-[var(--admin-text-muted)]">
          <ImageIcon className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-sm">No images found</p>
        </div>
      )}
    </div>
  );
}
