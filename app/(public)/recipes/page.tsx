import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RecipeCard } from "@/components/recipe-card";
import { mockRecipes, mockCategories } from "@/lib/mock-data";
import type { Recipe } from "@/lib/types";

export function generateMetadata(): Metadata {
  return {
    title: "All Recipes",
  };
}

const difficulties = ["all", "easy", "medium", "hard"] as const;

const categoryFilters =
  mockCategories.find((c) => c.slug === "recipes")?.children ?? [];

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ difficulty?: string; category?: string }>;
}) {
  const { difficulty, category } = await searchParams;

  const activeDifficulty = difficulty ?? "all";
  const activeCategory = category ?? "all";

  let filtered: Recipe[] = mockRecipes;

  if (activeDifficulty !== "all") {
    filtered = filtered.filter((r) => r.difficulty === activeDifficulty);
  }

  if (activeCategory !== "all") {
    filtered = filtered.filter((r) => r.category?.slug === activeCategory);
  }

  function buildHref(overrides: {
    difficulty?: string;
    category?: string;
  }): string {
    const d = overrides.difficulty ?? activeDifficulty;
    const c = overrides.category ?? activeCategory;
    const params = new URLSearchParams();
    if (d !== "all") params.set("difficulty", d);
    if (c !== "all") params.set("category", c);
    return params.toString() ? `/recipes?${params.toString()}` : "/recipes";
  }

  return (
    <main
      className="mx-auto w-full px-[var(--space-lg)]"
      style={{ maxWidth: "var(--container-xl)" }}
    >
      {/* ── Page header ── */}
      <header className="pb-[var(--space-2xl)] pt-[var(--space-4xl)]">
        <h1
          className="font-display text-[var(--text-5xl)] font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)]"
          style={{ color: "var(--color-text)" }}
        >
          All Recipes
        </h1>
        <p
          className="mt-[var(--space-sm)] text-[var(--text-lg)] leading-[var(--leading-relaxed)]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Every recipe rigorously tested, every technique explained.
        </p>
      </header>

      {/* ── Filter bar ── */}
      <section
        className="space-y-[var(--space-md)] pb-[var(--space-2xl)]"
        aria-label="Filters"
      >
        {/* Difficulty pills */}
        <div className="flex flex-wrap items-center gap-[var(--space-sm)]">
          <span
            className="mr-[var(--space-xs)] text-[var(--text-sm)] font-medium uppercase tracking-[var(--tracking-wide)]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Difficulty
          </span>
          {difficulties.map((d) => (
            <Link
              key={d}
              href={buildHref({ difficulty: d })}
              className={cn(
                "inline-flex items-center rounded-[var(--radius-full)] px-[var(--space-md)] py-[var(--space-xs)] text-[var(--text-sm)] font-medium capitalize transition-colors",
                activeDifficulty === d
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
              )}
              style={{ transitionDuration: "var(--transition-fast)" }}
            >
              {d}
            </Link>
          ))}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap items-center gap-[var(--space-sm)]">
          <span
            className="mr-[var(--space-xs)] text-[var(--text-sm)] font-medium uppercase tracking-[var(--tracking-wide)]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Category
          </span>
          <Link
            href={buildHref({ category: "all" })}
            className={cn(
              "inline-flex items-center rounded-[var(--radius-full)] px-[var(--space-md)] py-[var(--space-xs)] text-[var(--text-sm)] font-medium transition-colors",
              activeCategory === "all"
                ? "bg-[var(--color-accent)] text-white"
                : "bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
            )}
            style={{ transitionDuration: "var(--transition-fast)" }}
          >
            All
          </Link>
          {categoryFilters.map((cat) => (
            <Link
              key={cat.slug}
              href={buildHref({ category: cat.slug })}
              className={cn(
                "inline-flex items-center rounded-[var(--radius-full)] px-[var(--space-md)] py-[var(--space-xs)] text-[var(--text-sm)] font-medium transition-colors",
                activeCategory === cat.slug
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
              )}
              style={{ transitionDuration: "var(--transition-fast)" }}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recipe count ── */}
      <p
        className="pb-[var(--space-lg)] text-[var(--text-sm)] font-medium"
        style={{ color: "var(--color-text-muted)" }}
      >
        Showing {filtered.length} recipe{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* ── Recipe grid or empty state ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-[var(--space-xl)] pb-[var(--space-4xl)] sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center pb-[var(--space-4xl)] pt-[var(--space-3xl)] text-center">
          <p
            className="font-display text-[var(--text-2xl)] font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            No recipes found
          </p>
          <p
            className="mt-[var(--space-sm)] max-w-md text-[var(--text-base)] leading-[var(--leading-relaxed)]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Try adjusting your filters. We add new rigorously tested recipes
            every week.
          </p>
          <Link
            href="/recipes"
            className="mt-[var(--space-lg)] inline-flex items-center rounded-[var(--radius-full)] bg-[var(--color-accent)] px-[var(--space-xl)] py-[var(--space-sm)] text-[var(--text-sm)] font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
            style={{ transitionDuration: "var(--transition-fast)" }}
          >
            Clear all filters
          </Link>
        </div>
      )}
    </main>
  );
}
