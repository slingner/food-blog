"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, ArrowLeft, Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";
import { IngredientEditor } from "./IngredientEditor";
import { StepEditor } from "./StepEditor";
import { MediaUploader, ImagePreview } from "./MediaUploader";
import { ImagePicker } from "./ImagePicker";
import type {
  RecipeFormData,
  IngredientFormData,
  StepFormData,
  Category,
} from "@/lib/types";

type Props = {
  initialData?: RecipeFormData & { id?: number };
  categories: Category[];
  onSave: (data: RecipeFormData) => Promise<unknown>;
};

const DIFFICULTIES = [
  { value: "", label: "Select difficulty" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const TABS = [
  { key: "details", label: "Details" },
  { key: "ingredients", label: "Ingredients" },
  { key: "steps", label: "Steps" },
  { key: "media", label: "Media" },
] as const;

type Tab = (typeof TABS)[number]["key"];

export function RecipeEditor({ initialData, categories, onSave }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [saving, setSaving] = useState(false);
  const [heroPickerOpen, setHeroPickerOpen] = useState(false);

  const [form, setForm] = useState<RecipeFormData>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    introHtml: initialData?.introHtml ?? "",
    heroImage: initialData?.heroImage ?? null,
    heroVideo: initialData?.heroVideo ?? null,
    prepTime: initialData?.prepTime ?? null,
    cookTime: initialData?.cookTime ?? null,
    restTime: initialData?.restTime ?? null,
    servings: initialData?.servings ?? 4,
    difficulty: initialData?.difficulty ?? null,
    published: initialData?.published ?? false,
    featured: initialData?.featured ?? false,
    categoryId: initialData?.categoryId ?? null,
    ingredients: initialData?.ingredients ?? [],
    steps: initialData?.steps ?? [],
  });

  const updateField = <K extends keyof RecipeFormData>(
    key: K,
    value: RecipeFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange = (title: string) => {
    updateField("title", title);
    // Auto-generate slug from title if slug was matching old auto-slug
    if (!initialData?.slug || form.slug === slugify(form.title)) {
      updateField("slug", slugify(title));
    }
  };

  const handleSave = async (publish?: boolean) => {
    setSaving(true);
    try {
      const data = {
        ...form,
        published: publish !== undefined ? publish : form.published,
      };
      await onSave(data);
      router.push("/admin/recipes");
      router.refresh();
    } catch {
      console.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/recipes")}
            className="flex items-center justify-center w-8 h-8 rounded-md text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface-raised)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-[var(--admin-text)] tracking-tight">
              {initialData?.id ? "Edit Recipe" : "New Recipe"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!form.published && (
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-lg border border-[var(--admin-border-subtle)] text-sm font-medium text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-raised)] transition-colors disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              Save & Publish
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Draft"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--admin-surface)] w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-[var(--admin-surface-raised)] text-[var(--admin-text)]"
                : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)]"
            }`}
          >
            {tab.label}
            {tab.key === "ingredients" && form.ingredients.length > 0 && (
              <span className="ml-1.5 text-xs opacity-60">
                {form.ingredients.length}
              </span>
            )}
            {tab.key === "steps" && form.steps.length > 0 && (
              <span className="ml-1.5 text-xs opacity-60">
                {form.steps.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] p-5 sm:p-6">
        {/* ─── Details Tab ─── */}
        {activeTab === "details" && (
          <div className="space-y-6 max-w-2xl">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)]">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Recipe title"
                className="w-full h-10 px-3 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border-subtle)] text-[var(--admin-text)] text-sm placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40 focus:border-[var(--admin-accent)]"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)]">
                Slug
              </label>
              <div className="flex items-center gap-0">
                <span className="h-10 px-3 flex items-center rounded-l-lg bg-[var(--admin-surface-raised)] border border-r-0 border-[var(--admin-border-subtle)] text-sm text-[var(--admin-text-muted)] font-mono">
                  /recipes/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  className="flex-1 h-10 px-3 rounded-r-lg bg-[var(--admin-bg)] border border-[var(--admin-border-subtle)] text-[var(--admin-text)] text-sm font-mono placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40 focus:border-[var(--admin-accent)]"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)]">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Brief description for cards and SEO"
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border-subtle)] text-[var(--admin-text)] text-sm placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40 focus:border-[var(--admin-accent)] resize-none"
              />
            </div>

            {/* Category + Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[var(--admin-text-secondary)]">
                  Category
                </label>
                <select
                  value={form.categoryId ?? ""}
                  onChange={(e) =>
                    updateField(
                      "categoryId",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="w-full h-10 px-3 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border-subtle)] text-[var(--admin-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40 focus:border-[var(--admin-accent)]"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[var(--admin-text-secondary)]">
                  Difficulty
                </label>
                <select
                  value={form.difficulty ?? ""}
                  onChange={(e) =>
                    updateField(
                      "difficulty",
                      (e.target.value || null) as RecipeFormData["difficulty"]
                    )
                  }
                  className="w-full h-10 px-3 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border-subtle)] text-[var(--admin-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40 focus:border-[var(--admin-accent)]"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Times + Servings */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[var(--admin-text-secondary)]">
                  Prep Time
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.prepTime ?? ""}
                    onChange={(e) =>
                      updateField(
                        "prepTime",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    placeholder="0"
                    className="w-full h-10 px-3 pr-10 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border-subtle)] text-[var(--admin-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--admin-text-muted)]">
                    min
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[var(--admin-text-secondary)]">
                  Cook Time
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.cookTime ?? ""}
                    onChange={(e) =>
                      updateField(
                        "cookTime",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    placeholder="0"
                    className="w-full h-10 px-3 pr-10 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border-subtle)] text-[var(--admin-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--admin-text-muted)]">
                    min
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[var(--admin-text-secondary)]">
                  Rest Time
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.restTime ?? ""}
                    onChange={(e) =>
                      updateField(
                        "restTime",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    placeholder="0"
                    className="w-full h-10 px-3 pr-10 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border-subtle)] text-[var(--admin-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--admin-text-muted)]">
                    min
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[var(--admin-text-secondary)]">
                  Servings
                </label>
                <input
                  type="number"
                  value={form.servings}
                  onChange={(e) =>
                    updateField("servings", Number(e.target.value) || 1)
                  }
                  min={1}
                  className="w-full h-10 px-3 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border-subtle)] text-[var(--admin-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40"
                />
              </div>
            </div>

            {/* Hero Image */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)]">
                Hero Image
              </label>
              {form.heroImage ? (
                <ImagePreview
                  url={form.heroImage}
                  onRemove={() => updateField("heroImage", null)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setHeroPickerOpen(true)}
                  className="w-full flex items-center justify-center gap-2 h-32 rounded-lg border-2 border-dashed border-[var(--admin-border-subtle)] text-sm text-[var(--admin-text-muted)] hover:border-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)] transition-colors"
                >
                  Choose hero image
                </button>
              )}
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateField("featured", e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--admin-border-subtle)] bg-[var(--admin-bg)] text-[var(--admin-accent)] focus:ring-[var(--admin-accent)]/40"
                />
                <span className="text-sm text-[var(--admin-text-secondary)]">
                  Featured recipe
                </span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => updateField("published", e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--admin-border-subtle)] bg-[var(--admin-bg)] text-[var(--admin-accent)] focus:ring-[var(--admin-accent)]/40"
                />
                <span className="text-sm text-[var(--admin-text-secondary)]">
                  Published
                </span>
              </label>
            </div>
          </div>
        )}

        {/* ─── Ingredients Tab ─── */}
        {activeTab === "ingredients" && (
          <IngredientEditor
            ingredients={form.ingredients}
            onChange={(ingredients) => updateField("ingredients", ingredients)}
          />
        )}

        {/* ─── Steps Tab ─── */}
        {activeTab === "steps" && (
          <StepEditor
            steps={form.steps}
            onChange={(steps) => updateField("steps", steps)}
          />
        )}

        {/* ─── Media Tab ─── */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-[var(--admin-text)] mb-3">
                Upload Images
              </h3>
              <MediaUploader
                onUpload={(url) => {
                  // For now, just set as hero image if none exists
                  if (!form.heroImage) {
                    updateField("heroImage", url);
                  }
                }}
              />
            </div>

            {form.heroImage && (
              <div>
                <h3 className="text-sm font-medium text-[var(--admin-text)] mb-3">
                  Current Hero Image
                </h3>
                <ImagePreview
                  url={form.heroImage}
                  onRemove={() => updateField("heroImage", null)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hero image picker modal */}
      <ImagePicker
        open={heroPickerOpen}
        onClose={() => setHeroPickerOpen(false)}
        onSelect={(url) => updateField("heroImage", url)}
      />
    </div>
  );
}
