import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { mockRecipes } from "@/lib/mock-data";

const popularRecipes = mockRecipes.slice(0, 4);

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-[var(--space-md)]"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-lg mx-auto text-center">
        {/* Illustrated empty plate */}
        <div className="relative mx-auto mb-[var(--space-xl)] w-44 h-44">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: "var(--color-surface-raised)",
              border: "3px dashed var(--color-border)",
            }}
          />
          <div
            className="absolute inset-3 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <div className="text-center">
              <span className="block text-5xl mb-1" role="img" aria-label="empty plate">
                🍽️
              </span>
              <span
                className="font-display text-[var(--text-xs)] font-semibold tracking-wide uppercase"
                style={{ color: "var(--color-text-faint)" }}
              >
                404
              </span>
            </div>
          </div>
        </div>

        <h1
          className="font-display text-[var(--text-4xl)] font-bold mb-[var(--space-sm)] tracking-[var(--tracking-tight)]"
          style={{ color: "var(--color-text)" }}
        >
          This Dish Doesn&apos;t Exist
        </h1>

        <p
          className="text-[var(--text-lg)] mb-[var(--space-xl)] leading-[var(--leading-relaxed)]"
          style={{ color: "var(--color-text-muted)" }}
        >
          Looks like this recipe wandered off the menu. Maybe it&apos;s still
          resting, or maybe it never made it past the test kitchen.
        </p>

        {/* Search */}
        <div className="mb-[var(--space-2xl)] max-w-sm mx-auto">
          <p
            className="text-[var(--text-sm)] font-medium mb-[var(--space-sm)]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Try searching for something:
          </p>
          <SearchForm />
        </div>

        {/* Popular recipes */}
        <div
          className="rounded-[var(--radius-xl)] p-[var(--space-lg)]"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <h2
            className="font-display text-[var(--text-lg)] font-semibold mb-[var(--space-md)]"
            style={{ color: "var(--color-text)" }}
          >
            Popular Right Now
          </h2>
          <ul className="space-y-[var(--space-sm)] text-left">
            {popularRecipes.map((recipe) => (
              <li key={recipe.id}>
                <Link
                  href={`/recipes/${recipe.slug}`}
                  className="flex items-center gap-[var(--space-sm)] py-[var(--space-xs)] px-[var(--space-sm)] -mx-[var(--space-sm)] rounded-[var(--radius-md)] transition-colors hover:bg-[var(--color-surface-raised)]"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  />
                  <span className="text-[var(--text-sm)] font-medium">
                    {recipe.title}
                  </span>
                  {recipe.category && (
                    <span
                      className="text-[var(--text-xs)] ml-auto shrink-0"
                      style={{ color: "var(--color-text-faint)" }}
                    >
                      {recipe.category.name}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Back home */}
        <div className="mt-[var(--space-xl)] flex flex-col sm:flex-row gap-[var(--space-sm)] justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-[var(--text-sm)] font-medium rounded-[var(--radius-lg)] text-white transition-[background-color] duration-[var(--transition-fast)]"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            Back to Home
          </Link>
          <Link
            href="/recipes"
            className="inline-flex items-center justify-center px-6 py-3 text-[var(--text-sm)] font-medium rounded-[var(--radius-lg)] transition-colors"
            style={{
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          >
            Browse All Recipes
          </Link>
        </div>
      </div>
    </div>
  );
}
