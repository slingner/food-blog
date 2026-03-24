import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { RecipeCard } from "@/components/recipe-card";
import { NewsletterForm } from "@/components/newsletter-form";
import {
  mockCategories,
  getMockCategoryBySlug,
  getMockRecipesByCategory,
} from "@/lib/mock-data";

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const cat of mockCategories) {
    params.push({ slug: cat.slug });
    if (cat.children) {
      for (const child of cat.children) {
        params.push({ slug: child.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getMockCategoryBySlug(slug);
  return {
    title: category?.name ?? "Category Not Found",
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getMockCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const recipes = getMockRecipesByCategory(slug);

  // Resolve subcategory nav pills: show children if this is a parent,
  // or sibling categories if this is a child.
  const ownChildren = category.children;
  const parentWithSiblings = !ownChildren
    ? mockCategories.find((c) => c.children?.some((ch) => ch.slug === slug))
    : null;
  const navCategories = ownChildren ?? parentWithSiblings?.children ?? [];

  return (
    <main>
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-raised)" }}
      >
        <div
          className="mx-auto w-full px-[var(--space-lg)] pb-[var(--space-3xl)] pt-[var(--space-4xl)]"
          style={{ maxWidth: "var(--container-xl)" }}
        >
          <h1
            className="font-display text-[var(--text-5xl)] font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] sm:text-[var(--text-6xl)]"
            style={{ color: "var(--color-text)" }}
          >
            {category.name}
          </h1>
          {category.description && (
            <p
              className="mt-[var(--space-md)] max-w-2xl text-[var(--text-lg)] leading-[var(--leading-relaxed)]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {category.description}
            </p>
          )}
        </div>

        {/* Decorative bottom edge */}
        <div
          className="absolute bottom-0 left-0 h-px w-full"
          style={{ backgroundColor: "var(--color-border)" }}
          aria-hidden="true"
        />
      </section>

      {/* ── Subcategory navigation ── */}
      {navCategories.length > 0 && (
        <nav
          className="mx-auto w-full px-[var(--space-lg)] pt-[var(--space-xl)]"
          style={{ maxWidth: "var(--container-xl)" }}
          aria-label="Subcategories"
        >
          <div className="flex flex-wrap gap-[var(--space-sm)]">
            {navCategories.map((sub) => {
              const isActive = sub.slug === slug;
              return (
                <Link
                  key={sub.slug}
                  href={`/categories/${sub.slug}`}
                  className={cn(
                    "inline-flex items-center rounded-[var(--radius-full)] px-[var(--space-md)] py-[var(--space-sm)] text-[var(--text-sm)] font-medium transition-colors",
                    isActive
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)] hover:text-white"
                  )}
                  style={{ transitionDuration: "var(--transition-fast)" }}
                >
                  {sub.name}
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* ── Recipe grid ── */}
      <section
        className="mx-auto w-full px-[var(--space-lg)] py-[var(--space-2xl)]"
        style={{ maxWidth: "var(--container-xl)" }}
      >
        {recipes.length > 0 ? (
          <>
            <p
              className="pb-[var(--space-lg)] text-[var(--text-sm)] font-medium"
              style={{ color: "var(--color-text-muted)" }}
            >
              {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 gap-[var(--space-xl)] sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-[var(--space-4xl)] text-center">
            <p
              className="font-display text-[var(--text-2xl)] font-semibold"
              style={{ color: "var(--color-text)" }}
            >
              No recipes here yet
            </p>
            <p
              className="mt-[var(--space-sm)] max-w-md text-[var(--text-base)] leading-[var(--leading-relaxed)]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              We&apos;re still perfecting recipes for this category. We never
              publish until every detail is dialed in — check back soon.
            </p>
          </div>
        )}
      </section>

      {/* ── Newsletter CTA ── */}
      <section
        className="mx-auto px-[var(--space-lg)] pb-[var(--space-4xl)]"
        style={{ maxWidth: "var(--container-prose)" }}
      >
        <div
          className="rounded-[var(--radius-xl)] px-[var(--space-2xl)] py-[var(--space-3xl)] text-center"
          style={{ backgroundColor: "var(--color-surface-raised)" }}
        >
          <h2
            className="font-display text-[var(--text-2xl)] font-bold leading-[var(--leading-tight)]"
            style={{ color: "var(--color-text)" }}
          >
            Never miss a recipe
          </h2>
          <p
            className="mx-auto mt-[var(--space-sm)] max-w-md text-[var(--text-base)] leading-[var(--leading-relaxed)]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Join our newsletter for new recipes, technique deep-dives, and the
            occasional strong opinion about kitchen equipment.
          </p>
          <div className="mx-auto mt-[var(--space-xl)] max-w-sm">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
