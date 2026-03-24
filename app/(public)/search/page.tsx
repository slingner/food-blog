import Link from "next/link";
import { cn } from "@/lib/utils";
import { SearchForm } from "@/components/search-form";
import { RecipeCard } from "@/components/recipe-card";
import { searchMockRecipes } from "@/lib/mock-data";

const popularSearches = [
  "pasta",
  "chicken",
  "soup",
  "salmon",
  "cookies",
  "vegetarian",
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? searchMockRecipes(query) : [];

  return (
    <main
      className="mx-auto w-full px-[var(--space-lg)]"
      style={{ maxWidth: "var(--container-xl)" }}
    >
      {/* ── Search form ── */}
      <section
        className="mx-auto pb-[var(--space-3xl)] pt-[var(--space-4xl)]"
        style={{ maxWidth: "var(--container-prose)" }}
      >
        <h1
          className="mb-[var(--space-xl)] text-center font-display text-[var(--text-4xl)] font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)]"
          style={{ color: "var(--color-text)" }}
        >
          Search
        </h1>
        <SearchForm defaultQuery={query} />
      </section>

      {/* ── Results / Popular / Empty ── */}
      {query ? (
        results.length > 0 ? (
          /* ── Has results ── */
          <section className="pb-[var(--space-4xl)]">
            <div className="flex items-baseline justify-between pb-[var(--space-lg)]">
              <h2
                className="font-display text-[var(--text-2xl)] font-semibold leading-[var(--leading-tight)]"
                style={{ color: "var(--color-text)" }}
              >
                Results for &lsquo;{query}&rsquo;
              </h2>
              <span
                className="text-[var(--text-sm)] font-medium"
                style={{ color: "var(--color-text-muted)" }}
              >
                {results.length} recipe{results.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-[var(--space-xl)] sm:grid-cols-2 lg:grid-cols-3">
              {results.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>
        ) : (
          /* ── Query but no results ── */
          <section
            className="mx-auto pb-[var(--space-4xl)] text-center"
            style={{ maxWidth: "var(--container-prose)" }}
          >
            <p
              className="font-display text-[var(--text-2xl)] font-semibold"
              style={{ color: "var(--color-text)" }}
            >
              No results for &lsquo;{query}&rsquo;
            </p>
            <p
              className="mt-[var(--space-sm)] text-[var(--text-base)] leading-[var(--leading-relaxed)]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Try different keywords, check for typos, or browse one of our
              popular searches below.
            </p>
            <div className="mt-[var(--space-xl)] flex flex-wrap justify-center gap-[var(--space-sm)]">
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className={cn(
                    "inline-flex items-center rounded-[var(--radius-full)] px-[var(--space-md)] py-[var(--space-xs)] text-[var(--text-sm)] font-medium capitalize transition-colors",
                    "bg-[var(--color-surface-raised)] hover:bg-[var(--color-accent)] hover:text-white"
                  )}
                  style={{
                    color: "var(--color-text-secondary)",
                    transitionDuration: "var(--transition-fast)",
                  }}
                >
                  {term}
                </Link>
              ))}
            </div>
          </section>
        )
      ) : (
        /* ── No query: popular searches ── */
        <section
          className="mx-auto pb-[var(--space-4xl)] text-center"
          style={{ maxWidth: "var(--container-prose)" }}
        >
          <h2
            className="font-display text-[var(--text-xl)] font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            Popular Searches
          </h2>
          <p
            className="mt-[var(--space-xs)] text-[var(--text-sm)]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Not sure where to start? Try one of these.
          </p>
          <div className="mt-[var(--space-xl)] flex flex-wrap justify-center gap-[var(--space-sm)]">
            {popularSearches.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className={cn(
                  "inline-flex items-center rounded-[var(--radius-full)] border px-[var(--space-lg)] py-[var(--space-sm)] text-[var(--text-base)] font-medium capitalize transition-colors",
                  "hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
                )}
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-secondary)",
                  transitionDuration: "var(--transition-fast)",
                }}
              >
                {term}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
