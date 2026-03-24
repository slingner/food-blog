import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RecipeCard } from "@/components/recipe-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
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
  const subFeatured = featured.slice(1, 4);

  const categoryShowcase = mockCategories[0]?.children?.slice(0, 6) ?? [];

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="relative">
        <div className="mx-auto max-w-[var(--container-xl)] px-[var(--space-md)] py-[var(--space-xl)] lg:px-[var(--space-xl)] lg:py-[var(--space-3xl)]">
          <div className="grid gap-[var(--space-lg)] lg:grid-cols-[1.4fr_1fr] lg:gap-[var(--space-xl)]">
            {/* Main Hero Recipe */}
            {hero && (
              <Link
                href={`/recipes/${hero.slug}`}
                className="group relative block overflow-hidden rounded-[var(--radius-xl)]"
              >
                <div
                  className="aspect-[4/3] lg:aspect-[16/10]"
                  style={{
                    backgroundColor:
                      heroPlaceholderColors[hero.id] ?? "var(--color-surface-raised)",
                  }}
                >
                  <div className="absolute inset-0 flex items-end">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="relative p-[var(--space-lg)] lg:p-[var(--space-2xl)]">
                      {hero.category && (
                        <Badge
                          variant="secondary"
                          className="mb-[var(--space-sm)] bg-white/20 text-white backdrop-blur-sm border-white/10"
                        >
                          {hero.category.name}
                        </Badge>
                      )}
                      <h1 className="font-display text-[var(--text-3xl)] lg:text-[var(--text-5xl)] font-bold text-white leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] mb-[var(--space-sm)]">
                        {hero.title}
                      </h1>
                      <p className="text-[var(--text-base)] lg:text-[var(--text-lg)] text-white/80 max-w-xl leading-[var(--leading-normal)] line-clamp-2">
                        {hero.description}
                      </p>
                      <div className="mt-[var(--space-md)] flex items-center gap-[var(--space-md)] text-[var(--text-sm)] text-white/70">
                        {hero.prepTime != null && hero.cookTime != null && (
                          <span>{formatMinutes(hero.prepTime + hero.cookTime)}</span>
                        )}
                        {hero.difficulty && (
                          <span className="capitalize">{hero.difficulty}</span>
                        )}
                        {hero.reviewStats && (
                          <span className="flex items-center gap-1">
                            <StarRating
                              rating={hero.reviewStats.averageRating}
                            />
                            <span>({hero.reviewStats.totalReviews})</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[var(--radius-xl)]" />
              </Link>
            )}

            {/* Sub-Featured Stack */}
            <div className="flex flex-col gap-[var(--space-md)]">
              {subFeatured.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.slug}`}
                  className="group flex gap-[var(--space-md)] items-start rounded-[var(--radius-lg)] p-[var(--space-sm)] -mx-[var(--space-sm)] transition-colors hover:bg-[var(--color-surface)]"
                >
                  <div
                    className="w-24 h-24 lg:w-28 lg:h-28 shrink-0 rounded-[var(--radius-md)] overflow-hidden"
                    style={{
                      backgroundColor:
                        heroPlaceholderColors[recipe.id] ??
                        "var(--color-surface-raised)",
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-[var(--text-2xl)] text-white/60 font-bold">
                        {recipe.title.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 py-[var(--space-xs)]">
                    {recipe.category && (
                      <span
                        className="text-[var(--text-xs)] font-medium uppercase tracking-[0.08em]"
                        style={{ color: "var(--color-accent)" }}
                      >
                        {recipe.category.name}
                      </span>
                    )}
                    <h3 className="font-display text-[var(--text-lg)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
                      {recipe.title}
                    </h3>
                    <p
                      className="text-[var(--text-sm)] mt-1 line-clamp-2"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {recipe.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Latest Recipes ─── */}
      <section
        className="py-[var(--space-3xl)]"
        style={{ borderTop: "1px solid var(--color-border-subtle)" }}
      >
        <div className="mx-auto max-w-[var(--container-xl)] px-[var(--space-md)] lg:px-[var(--space-xl)]">
          <div className="flex items-end justify-between mb-[var(--space-xl)]">
            <div>
              <h2 className="font-display text-[var(--text-3xl)] lg:text-[var(--text-4xl)] font-bold tracking-[var(--tracking-tight)]">
                Latest Recipes
              </h2>
              <p
                className="mt-[var(--space-xs)] text-[var(--text-base)]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Fresh from the test kitchen
              </p>
            </div>
            <Link
              href="/recipes"
              className="hidden sm:flex items-center gap-1 text-[var(--text-sm)] font-medium hover:text-[var(--color-accent)] transition-colors"
            >
              View all recipes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid gap-[var(--space-lg)] sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          <div className="mt-[var(--space-xl)] text-center sm:hidden">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-1 text-[var(--text-sm)] font-medium hover:text-[var(--color-accent)] transition-colors"
            >
              View all recipes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Category Showcase ─── */}
      <section
        className="py-[var(--space-3xl)]"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="mx-auto max-w-[var(--container-xl)] px-[var(--space-md)] lg:px-[var(--space-xl)]">
          <div className="text-center mb-[var(--space-2xl)]">
            <h2 className="font-display text-[var(--text-3xl)] lg:text-[var(--text-4xl)] font-bold tracking-[var(--tracking-tight)]">
              Explore by Category
            </h2>
            <p
              className="mt-[var(--space-xs)] text-[var(--text-base)]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Find exactly what you&apos;re craving
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[var(--space-md)]">
            {categoryShowcase.map((cat, i) => {
              const categoryColors = [
                "#c45d3e",
                "#d4a853",
                "#4a7a3d",
                "#6b4226",
                "#2d7a4f",
                "#c47a1a",
              ];
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group relative flex flex-col items-center text-center p-[var(--space-lg)] rounded-[var(--radius-xl)] transition-all hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
                  style={{ backgroundColor: "var(--color-bg)" }}
                >
                  <div
                    className="w-16 h-16 rounded-full mb-[var(--space-md)] flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${categoryColors[i]}15` }}
                  >
                    <span
                      className="font-display text-[var(--text-2xl)] font-bold"
                      style={{ color: categoryColors[i] }}
                    >
                      {cat.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-[var(--text-sm)] font-medium leading-snug">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Newsletter CTA ─── */}
      <section className="py-[var(--space-4xl)]">
        <div className="mx-auto max-w-[var(--container-md)] px-[var(--space-md)] text-center">
          <h2 className="font-display text-[var(--text-3xl)] lg:text-[var(--text-4xl)] font-bold tracking-[var(--tracking-tight)]">
            Never Miss a Recipe
          </h2>
          <p
            className="mt-[var(--space-sm)] text-[var(--text-lg)] max-w-md mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Get our best recipes, techniques, and kitchen tips delivered to your
            inbox every week.
          </p>
          <div className="mt-[var(--space-xl)] max-w-sm mx-auto">
            <NewsletterForm />
          </div>
          <p
            className="mt-[var(--space-md)] text-[var(--text-xs)]"
            style={{ color: "var(--color-text-faint)" }}
          >
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
