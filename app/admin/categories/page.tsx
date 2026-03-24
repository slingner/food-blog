"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, FolderTree, GripVertical, X, Check } from "lucide-react";
import type { Category } from "@/lib/types";

const stubCategories: Category[] = [
  { id: 1, name: "Breads", slug: "breads", description: "Artisan breads and baked goods", parentId: null, sortOrder: 0, createdAt: new Date() },
  { id: 2, name: "Mains", slug: "mains", description: "Main course dishes", parentId: null, sortOrder: 1, createdAt: new Date() },
  { id: 3, name: "Desserts", slug: "desserts", description: "Sweet treats and desserts", parentId: null, sortOrder: 2, createdAt: new Date() },
  { id: 4, name: "Salads", slug: "salads", description: "Fresh salads and bowls", parentId: null, sortOrder: 3, createdAt: new Date() },
  { id: 5, name: "Soups", slug: "soups", description: "Soups, stews, and broths", parentId: null, sortOrder: 4, createdAt: new Date() },
  { id: 6, name: "Pasta", slug: "pasta", description: "Pasta dishes", parentId: 2, sortOrder: 0, createdAt: new Date() },
  { id: 7, name: "Grilled", slug: "grilled", description: "Grilled meats and vegetables", parentId: 2, sortOrder: 1, createdAt: new Date() },
];

type EditingCategory = {
  id: number | null;
  name: string;
  slug: string;
  description: string;
  parentId: number | null;
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export default function CategoryManagementPage() {
  const [categories] = useState(stubCategories);
  const [editing, setEditing] = useState<EditingCategory | null>(null);

  const topLevel = categories.filter((c) => !c.parentId);
  const getChildren = (parentId: number) =>
    categories.filter((c) => c.parentId === parentId);

  const startNew = () => {
    setEditing({ id: null, name: "", slug: "", description: "", parentId: null });
  };

  const startEdit = (cat: Category) => {
    setEditing({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      parentId: cat.parentId,
    });
  };

  const handleSave = () => {
    // Stub — would call createCategory or updateCategory action
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--admin-text)] tracking-tight">
            Categories
          </h1>
          <p className="text-sm text-[var(--admin-text-muted)] mt-1">
            Organize your recipes into categories
          </p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      {/* Edit/Create form */}
      {editing && (
        <div className="rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-accent)]/30 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--admin-text)]">
              {editing.id ? "Edit Category" : "New Category"}
            </h2>
            <button
              onClick={() => setEditing(null)}
              className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)]">
                Name
              </label>
              <input
                type="text"
                value={editing.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setEditing({
                    ...editing,
                    name,
                    slug: editing.id ? editing.slug : slugify(name),
                  });
                }}
                placeholder="Category name"
                className="w-full h-9 px-3 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border-subtle)] text-[var(--admin-text)] text-sm placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)]">
                Slug
              </label>
              <input
                type="text"
                value={editing.slug}
                onChange={(e) =>
                  setEditing({ ...editing, slug: e.target.value })
                }
                className="w-full h-9 px-3 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border-subtle)] text-[var(--admin-text)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)]">
                Description
              </label>
              <input
                type="text"
                value={editing.description}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
                placeholder="Brief description"
                className="w-full h-9 px-3 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border-subtle)] text-[var(--admin-text)] text-sm placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)]">
                Parent Category
              </label>
              <select
                value={editing.parentId ?? ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    parentId: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full h-9 px-3 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border-subtle)] text-[var(--admin-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40"
              >
                <option value="">None (top level)</option>
                {topLevel
                  .filter((c) => c.id !== editing.id)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 h-8 px-3 rounded-lg bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white text-sm font-medium transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              {editing.id ? "Update" : "Create"}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="h-8 px-3 rounded-lg text-sm text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-raised)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Category tree */}
      <div className="rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] divide-y divide-[var(--admin-border)]">
        {topLevel.map((cat) => {
          const children = getChildren(cat.id);
          return (
            <div key={cat.id}>
              <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--admin-surface-raised)]/50 transition-colors">
                <GripVertical className="w-4 h-4 text-[var(--admin-text-muted)] cursor-grab shrink-0" />
                <FolderTree className="w-4 h-4 text-[var(--admin-accent)] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--admin-text)]">
                    {cat.name}
                  </p>
                  {cat.description && (
                    <p className="text-xs text-[var(--admin-text-muted)] truncate">
                      {cat.description}
                    </p>
                  )}
                </div>
                <span className="text-xs font-mono text-[var(--admin-text-muted)]">
                  /{cat.slug}
                </span>
                {children.length > 0 && (
                  <span className="text-[10px] font-medium text-[var(--admin-text-muted)] bg-[var(--admin-surface-raised)] px-1.5 py-0.5 rounded">
                    {children.length} sub
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-1.5 rounded text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface-raised)] transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded text-[var(--admin-text-muted)] hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Children */}
              {children.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center gap-3 pl-14 pr-5 py-3 hover:bg-[var(--admin-surface-raised)]/50 transition-colors border-t border-[var(--admin-border)]"
                >
                  <GripVertical className="w-4 h-4 text-[var(--admin-text-muted)] cursor-grab shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--admin-text-secondary)]">
                      {child.name}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[var(--admin-text-muted)]">
                    /{child.slug}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(child)}
                      className="p-1.5 rounded text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface-raised)] transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded text-[var(--admin-text-muted)] hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
