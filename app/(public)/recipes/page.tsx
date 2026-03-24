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
      <header className="pb-[var(--space-xl)] pt-[var(--space-4xl)]">
        <h1
          className="font-display text-[var(--text-4xl)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)]"
          style={{ color: "var(--color-text)" }}
        >
          Recipes
        </h1>
        <p
          className="mt-[var(--space-xs)] text-[var(--text-base)] leading-[var(--leading-relaxed)]"
          style={{ color: "var(--color-text-muted)" }}
        >
          A cooking diary of sorts.
        </p>
      </header>

      {/* ── Filter bar ── */}
      <section
        className="space-y-[var(--space-md)] pb-[var(--space-2xl)]"
        aria-label="Filters"
      >
        {/* Difficulty filters */}
        <div className="flex flex-wrap items-center gap-[var(--space-md)]">
          <span
            className="text-[var(--text-xs)] font-medium uppercase tracking-[var(--tracking-wide)]"
            style={{ color: "var(--color-text-faint)" }}
          >
            Difficulty
          </span>
          {difficulties.map((d) => (
            <Link
              key={d}
              href={buildHref({ difficulty: d })}
              className={cn(
                "text-[var(--text-sm)] capitalize transition-colors pb-[var(--space-xs)]",
                activeDifficulty === d
                  ? "font-medium border-b border-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              )}
              style={
                activeDifficulty === d
                  ? { color: "var(--color-accent)" }
                  : undefined
              }
            >
              {d}
            </Link>
          ))}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-[var(--space-md)]">
          <span
            className="text-[var(--text-xs)] font-medium uppercase tracking-[var(--tracking-wide)]"
            style={{ color: "var(--color-text-faint)" }}
          >
            Category
          </span>
          <Link
            href={buildHref({ category: "all" })}
            className={cn(
              "text-[var(--text-sm)] transition-colors pb-[var(--space-xs)]",
              activeCategory === "all"
                ? "font-medium border-b border-[var(--color-accent)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
            )}
            style={
              activeCategory === "all"
                ? { color: "var(--color-accent)" }
                : undefined
            }
          >
            All
          </Link>
          {categoryFilters.map((cat) => (
            <Link
              key={cat.slug}
              href={buildHref({ category: cat.slug })}
              className={cn(
                "text-[var(--text-sm)] transition-colors pb-[var(--space-xs)]",
                activeCategory === cat.slug
                  ? "font-medium border-b border-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              )}
              style={
                activeCategory === cat.slug
                  ? { color: "var(--color-accent)" }
                  : undefined
              }
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recipe count ── */}
      <p
        className="pb-[var(--space-lg)] text-[var(--text-xs)] tracking-[var(--tracking-wide)]"
        style={{ color: "var(--color-text-faint)" }}
      >
        {filtered.length} recipe{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* ── Recipe grid or empty state ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-[var(--space-2xl)] pb-[var(--space-4xl)] sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center pb-[var(--space-4xl)] pt-[var(--space-3xl)] text-center">
          <p
            className="font-display text-[var(--text-2xl)]"
            style={{ color: "var(--color-text)" }}
          >
            No recipes found
          </p>
          <p
            className="mt-[var(--space-sm)] max-w-md text-[var(--text-base)] leading-[var(--leading-relaxed)]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Try adjusting your filters. We add new recipes every week.
          </p>
          <Link
            href="/recipes"
            className="mt-[var(--space-lg)] text-[var(--text-sm)] font-medium transition-colors pb-[var(--space-xs)] border-b border-[var(--color-accent)]"
            style={{ color: "var(--color-accent)" }}
          >
            Clear all filters
          </Link>
        </div>
      )}
    </main>
  );
}
