import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { mockRecipes } from "@/lib/mock-data";

const popularRecipes = mockRecipes.slice(0, 4);

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-[var(--space-lg)]"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-lg mx-auto text-center">
        {/* Whimsical illustration: a fork with a question mark */}
        <div className="relative mx-auto mb-[var(--space-xl)] w-32 h-32">
          {/* Plate */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface)",
            }}
          />
          {/* Inner plate ring */}
          <div
            className="absolute inset-4 rounded-full"
            style={{ border: "1px solid var(--color-border-subtle)" }}
          />
          {/* Fork and question mark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-[var(--text-4xl)] leading-none select-none" style={{ color: "var(--color-border)" }}>
              ?
            </span>
          </div>
          {/* Decorative utensils peeking from the side */}
          <div
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-[1px]"
            style={{ backgroundColor: "var(--color-border)" }}
          />
          <div
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-[1px]"
            style={{ backgroundColor: "var(--color-border)" }}
          />
        </div>

        {/* 404 number — whisper light */}
        <p
          className="font-display text-[var(--text-sm)] tracking-[0.3em] uppercase select-none"
          style={{ color: "var(--color-text-faint)" }}
        >
          Error 404
        </p>

        <h1
          className="mt-[var(--space-md)] font-display text-[var(--text-3xl)] md:text-[var(--text-4xl)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)]"
          style={{ color: "var(--color-text)" }}
        >
          This dish isn&apos;t on the menu
        </h1>

        <p
          className="mt-[var(--space-md)] text-[var(--text-base)] leading-[var(--leading-relaxed)] max-w-sm mx-auto"
          style={{ color: "var(--color-text-muted)" }}
        >
          The page you&apos;re looking for may have been moved, renamed, or
          perhaps it was just a figment of a hungry imagination.
        </p>

        {/* Search */}
        <div className="mt-[var(--space-2xl)] max-w-sm mx-auto">
          <SearchForm autoFocus={false} />
        </div>

        {/* Popular recipes as gentle suggestions */}
        <div className="mt-[var(--space-2xl)]">
          <p
            className="text-[var(--text-xs)] tracking-[0.1em] uppercase mb-[var(--space-md)]"
            style={{ color: "var(--color-text-faint)" }}
          >
            Try one of these instead
          </p>
          <div className="flex flex-wrap justify-center gap-x-[var(--space-md)] gap-y-[var(--space-xs)]">
            {popularRecipes.map((recipe, i) => (
              <span key={recipe.id} className="flex items-center gap-[var(--space-md)]">
                <Link
                  href={`/recipes/${recipe.slug}`}
                  className="text-[var(--text-sm)] transition-colors hover:text-[var(--color-accent)]"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {recipe.title}
                </Link>
                {i < popularRecipes.length - 1 && (
                  <span style={{ color: "var(--color-border)" }}>&middot;</span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* Single elegant link home */}
        <Link
          href="/"
          className="text-[var(--text-sm)] font-medium transition-colors hover:text-[var(--color-accent)]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          &larr; Back to The Hungry Milo
        </Link>
      </div>
    </div>
  );
}
