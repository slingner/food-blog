import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { RecipeCard } from "@/components/recipe-card";
import {
  getMockFeaturedRecipes,
  getMockLatestRecipes,
  mockCategories,
  heroPlaceholderColors,
} from "@/lib/mock-data";
import { formatMinutes } from "@/lib/utils";

export default function HomePage() {
  const featured = getMockFeaturedRecipes();
  const latest = getMockLatestRecipes(6);
  const hero = featured[0];

  const categoryShowcase = mockCategories[0]?.children?.slice(0, 6) ?? [];

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="relative">
        <div className="mx-auto max-w-[var(--container-xl)] px-[var(--space-md)] py-[var(--space-3xl)] lg:px-[var(--space-xl)] lg:py-[var(--space-4xl)]">
          {hero && (
            <Link
              href={`/recipes/${hero.slug}`}
              className="group block"
            >
              <div
                className="relative aspect-[16/9] lg:aspect-[2.2/1] overflow-hidden"
                style={{
                  borderRadius: "var(--radius-xl)",
                  backgroundColor:
                    heroPlaceholderColors[hero.id] ?? "var(--color-surface-raised)",
                }}
              >
                {hero.heroImage && (
                  <Image
                    src={hero.heroImage}
                    alt={hero.title}
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                )}
              </div>
              <div className="mt-[var(--space-lg)] lg:mt-[var(--space-xl)]">
                {hero.category && (
                  <span
                    className="text-[11px] font-medium uppercase tracking-[0.12em]"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {hero.category.name}
                  </span>
                )}
                <h1 className="font-display text-[var(--text-3xl)] lg:text-[var(--text-5xl)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] mt-[var(--space-xs)] group-hover:text-[var(--color-accent)] transition-colors">
                  {hero.title}
                </h1>
                {hero.description && (
                  <p
                    className="mt-[var(--space-sm)] text-[var(--text-base)] lg:text-[var(--text-lg)] max-w-2xl leading-[var(--leading-relaxed)]"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {hero.description}
                  </p>
                )}
                {hero.prepTime != null && hero.cookTime != null && (
                  <p
                    className="text-[var(--text-sm)] mt-[var(--space-sm)]"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {formatMinutes(hero.prepTime + hero.cookTime)}
                  </p>
                )}
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* ─── Latest Recipes ─── */}
      <section className="py-[var(--space-3xl)] lg:py-[var(--space-4xl)]">
        <div className="mx-auto max-w-[var(--container-xl)] px-[var(--space-md)] lg:px-[var(--space-xl)]">
          {/* Heading with thin decorative line */}
          <div className="flex items-center gap-[var(--space-lg)] mb-[var(--space-2xl)]">
            <h2
              className="font-display text-[var(--text-2xl)] lg:text-[var(--text-3xl)] font-semibold tracking-[var(--tracking-tight)] shrink-0"
              style={{ color: "var(--color-text)" }}
            >
              Latest Recipes
            </h2>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--color-border)" }}
            />
            <Link
              href="/recipes"
              className="hidden sm:flex items-center gap-1 text-[var(--text-sm)] font-medium shrink-0 transition-colors"
              style={{ color: "var(--color-text-muted)" }}
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Spacious grid */}
          <div className="grid gap-x-[var(--space-xl)] gap-y-[var(--space-2xl)] sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          <div className="mt-[var(--space-xl)] text-center sm:hidden">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-1 text-[var(--text-sm)] font-medium transition-colors"
              style={{ color: "var(--color-text-muted)" }}
            >
              View all recipes
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Category Showcase — editorial text links ─── */}
      <section className="py-[var(--space-3xl)] lg:py-[var(--space-4xl)]">
        <div className="mx-auto max-w-[var(--container-xl)] px-[var(--space-md)] lg:px-[var(--space-xl)]">
          <div className="text-center">
            <h2
              className="font-display text-[var(--text-2xl)] lg:text-[var(--text-3xl)] font-semibold tracking-[var(--tracking-tight)]"
              style={{ color: "var(--color-text)" }}
            >
              Explore
            </h2>
            <div
              className="mx-auto mt-[var(--space-md)] mb-[var(--space-xl)] h-px w-12"
              style={{ backgroundColor: "var(--color-border)" }}
            />

            {/* Elegant text links separated by dots */}
            <nav className="flex flex-wrap items-center justify-center gap-y-[var(--space-sm)]">
              {categoryShowcase.map((cat, i) => (
                <span key={cat.id} className="inline-flex items-center">
                  {i > 0 && (
                    <span
                      className="mx-[var(--space-md)] text-[var(--text-xs)] select-none"
                      style={{ color: "var(--color-text-faint)" }}
                      aria-hidden="true"
                    >
                      &middot;
                    </span>
                  )}
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-[var(--text-sm)] lg:text-[var(--text-base)] font-medium tracking-[0.02em] transition-colors hover:text-[var(--color-accent)]"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {cat.name}
                  </Link>
                </span>
              ))}
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
