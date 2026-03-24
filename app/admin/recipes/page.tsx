"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

// ─── Stub data ───

type RecipeRow = {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  featured: boolean;
  categoryName: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const stubRecipes: RecipeRow[] = [
  { id: 1, title: "Classic Sourdough Bread", slug: "classic-sourdough-bread", published: true, featured: true, categoryName: "Breads", createdAt: new Date("2025-02-10"), updatedAt: new Date("2025-03-15") },
  { id: 2, title: "Thai Green Curry", slug: "thai-green-curry", published: true, featured: false, categoryName: "Mains", createdAt: new Date("2025-02-14"), updatedAt: new Date("2025-03-10") },
  { id: 3, title: "Chocolate Lava Cake", slug: "chocolate-lava-cake", published: true, featured: true, categoryName: "Desserts", createdAt: new Date("2025-02-20"), updatedAt: new Date("2025-03-05") },
  { id: 4, title: "Homemade Pasta", slug: "homemade-pasta", published: false, featured: false, categoryName: "Mains", createdAt: new Date("2025-03-01"), updatedAt: new Date("2025-03-18") },
  { id: 5, title: "Roasted Vegetable Salad", slug: "roasted-vegetable-salad", published: true, featured: false, categoryName: "Salads", createdAt: new Date("2025-01-25"), updatedAt: new Date("2025-02-28") },
  { id: 6, title: "Miso Ramen", slug: "miso-ramen", published: false, featured: false, categoryName: "Soups", createdAt: new Date("2025-03-12"), updatedAt: new Date("2025-03-20") },
  { id: 7, title: "Croissants from Scratch", slug: "croissants-from-scratch", published: false, featured: false, categoryName: "Breads", createdAt: new Date("2025-03-15"), updatedAt: new Date("2025-03-21") },
];

type Filter = "all" | "published" | "draft";

export default function RecipeListPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const filtered = stubRecipes.filter((r) => {
    if (filter === "published" && !r.published) return false;
    if (filter === "draft" && r.published) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: stubRecipes.length },
    {
      key: "published",
      label: "Published",
      count: stubRecipes.filter((r) => r.published).length,
    },
    {
      key: "draft",
      label: "Drafts",
      count: stubRecipes.filter((r) => !r.published).length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--admin-text)] tracking-tight">
            Recipes
          </h1>
          <p className="text-sm text-[var(--admin-text-muted)] mt-1">
            Manage your recipe collection
          </p>
        </div>
        <Link
          href="/admin/recipes/new"
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Recipe
        </Link>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--admin-surface)]">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-[var(--admin-surface-raised)] text-[var(--admin-text)]"
                  : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)]"
              }`}
            >
              {f.label}
              <span className="ml-1.5 text-xs opacity-60">{f.count}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[var(--admin-surface)] border border-[var(--admin-border)] text-[var(--admin-text)] text-sm placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40 focus:border-[var(--admin-accent)] transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--admin-border)]">
                <th className="text-left text-xs font-medium text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3">
                  Recipe
                </th>
                <th className="text-left text-xs font-medium text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                  Category
                </th>
                <th className="text-left text-xs font-medium text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                  Updated
                </th>
                <th className="w-12 px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {filtered.map((recipe) => (
                <tr
                  key={recipe.id}
                  className="hover:bg-[var(--admin-surface-raised)]/50 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div>
                      <Link
                        href={`/admin/recipes/${recipe.id}/edit`}
                        className="text-sm font-medium text-[var(--admin-text)] hover:text-[var(--admin-accent)] transition-colors"
                      >
                        {recipe.title}
                      </Link>
                      {recipe.featured && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-400/10 text-amber-400">
                          Featured
                        </span>
                      )}
                      <p className="text-xs text-[var(--admin-text-muted)] mt-0.5 font-mono">
                        /{recipe.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-sm text-[var(--admin-text-secondary)]">
                      {recipe.categoryName ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        recipe.published
                          ? "bg-emerald-400/10 text-emerald-400"
                          : "bg-[var(--admin-surface-raised)] text-[var(--admin-text-muted)]"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          recipe.published ? "bg-emerald-400" : "bg-[var(--admin-text-muted)]"
                        }`}
                      />
                      {recipe.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-xs text-[var(--admin-text-muted)]">
                      {formatDate(recipe.updatedAt)}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenu(openMenu === recipe.id ? null : recipe.id)
                        }
                        className="flex items-center justify-center w-8 h-8 rounded-md text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface-raised)] transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenu === recipe.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenu(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-lg bg-[var(--admin-surface)] border border-[var(--admin-border-subtle)] shadow-lg py-1">
                            <Link
                              href={`/admin/recipes/${recipe.id}/edit`}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--admin-text-secondary)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface-raised)] transition-colors"
                              onClick={() => setOpenMenu(null)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Edit
                            </Link>
                            <button
                              className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--admin-text-secondary)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface-raised)] transition-colors w-full"
                              onClick={() => setOpenMenu(null)}
                            >
                              {recipe.published ? (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5" />
                                  Publish
                                </>
                              )}
                            </button>
                            <div className="my-1 border-t border-[var(--admin-border)]" />
                            <button
                              className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors w-full"
                              onClick={() => setOpenMenu(null)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-[var(--admin-text-muted)]"
                  >
                    No recipes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
