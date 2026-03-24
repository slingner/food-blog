import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDown,
} from "lucide-react";

import { cn, formatMinutes, formatDate } from "@/lib/utils";
import type { Recipe, Ingredient } from "@/lib/types";
import {
  getMockRecipeBySlug,
  mockRecipes,
  heroPlaceholderColors,
} from "@/lib/mock-data";
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { RecipeJsonLd } from "@/components/recipe-json-ld";
import {
  RecipeInteractivePanel,
  ServingCalculator,
  UnitToggle,
  IngredientList,
  CookMode,
  RecipeReviews,
  ShareButtons,
  BookmarkButton,
  PrintButton,
} from "@/components/recipe";

/* ─── Static generation ─── */

export async function generateStaticParams() {
  return mockRecipes.map((recipe) => ({ slug: recipe.slug }));
}

/* ─── Metadata ─── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getMockRecipeBySlug(slug);
  if (!recipe) return { title: "Recipe Not Found" };

  return {
    title: recipe.title,
    description: recipe.description ?? undefined,
    openGraph: {
      title: recipe.title,
      description: recipe.description ?? undefined,
      type: "article",
      ...(recipe.heroImage && { images: [{ url: recipe.heroImage }] }),
    },
  };
}

/* ─── Page ─── */

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getMockRecipeBySlug(slug);
  if (!recipe) notFound();

  const totalTime =
    (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0) + (recipe.restTime ?? 0);

  /* Group ingredients by groupName */
  const ingredientGroups = groupIngredients(recipe.ingredients ?? []);

  /* Build delicate meta line */
  const metaParts: string[] = [];
  if (totalTime > 0) metaParts.push(formatMinutes(totalTime));
  if (recipe.servings) metaParts.push(`${recipe.servings} servings`);
  if (recipe.difficulty)
    metaParts.push(
      recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)
    );

  return (
    <>
      <RecipeJsonLd recipe={recipe} />

      {/* ─── Hero ─── */}
      <RecipeHero recipe={recipe} />

      {/* ─── Title & meta below image ─── */}
      <header
        className="mx-auto px-[var(--space-lg)] pt-[var(--space-3xl)]"
        style={{ maxWidth: "var(--container-prose)" }}
      >
        {/* Breadcrumb */}
        {recipe.category && (
          <nav aria-label="Breadcrumb" className="mb-[var(--space-md)]">
            <ol className="flex items-center gap-[var(--space-xs)] text-[var(--text-sm)]" style={{ color: "var(--color-text-muted)" }}>
              <li>
                <Link
                  href="/recipes"
                  className="transition-colors hover:text-[var(--color-accent)]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Recipes
                </Link>
              </li>
              <li style={{ color: "var(--color-text-faint)" }}>/</li>
              <li>
                <Link
                  href={`/category/${recipe.category.slug}`}
                  className="transition-colors hover:text-[var(--color-accent)]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {recipe.category.name}
                </Link>
              </li>
            </ol>
          </nav>
        )}

        <h1
          className="font-display text-[var(--text-4xl)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] md:text-[var(--text-5xl)]"
          style={{ color: "var(--color-text)" }}
        >
          {recipe.title}
        </h1>

        {/* Delicate inline meta */}
        <p
          className="mt-[var(--space-md)] text-[var(--text-sm)] tracking-[var(--tracking-wide)]"
          style={{ color: "var(--color-text-muted)" }}
        >
          {metaParts.join(" \u00B7 ")}
        </p>

        <p
          className="mt-[var(--space-xs)] text-[var(--text-sm)]"
          style={{ color: "var(--color-text-faint)" }}
        >
          {formatDate(recipe.createdAt)}
        </p>
      </header>

      {/* ─── Jump to Recipe (sticky mobile) ─── */}
      <JumpToRecipe />

      {/* ─── Blog intro ─── */}
      {recipe.introHtml && (
        <section
          className="mx-auto px-[var(--space-lg)] py-[var(--space-3xl)]"
          style={{ maxWidth: "var(--container-prose)" }}
        >
          <div
            className={cn(
              "prose-custom",
              "[&>p]:text-[var(--text-lg)] [&>p]:leading-[var(--leading-relaxed)]",
              "[&>p]:text-[var(--color-text-secondary)]",
              "[&>p:first-child]:text-[var(--text-xl)] [&>p:first-child]:text-[var(--color-text)]",
              "[&>p:first-child]:font-medium",
              "[&>p+p]:mt-[var(--space-lg)]"
            )}
            dangerouslySetInnerHTML={{ __html: recipe.introHtml }}
          />
        </section>
      )}

      {/* ─── Section divider ─── */}
      <div className="divider" />

      {/* ─── Recipe Content ─── */}
      <section
        id="recipe"
        className="mx-auto px-[var(--space-lg)] pb-[var(--space-4xl)] pt-[var(--space-xl)]"
        style={{ maxWidth: "var(--container-prose)" }}
      >
        {/* Card header */}
        <h2
          className="font-display text-[var(--text-3xl)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]"
        >
          {recipe.title}
        </h2>
        {recipe.description && (
          <p className="mt-[var(--space-sm)] text-[var(--text-base)] leading-[var(--leading-relaxed)] text-[var(--color-text-muted)]">
            {recipe.description}
          </p>
        )}

        <RecipeInteractivePanel baseServings={recipe.servings}>
          {/* ─── Ingredients ─── */}
          <div className="mt-[var(--space-3xl)]">
            <h3
              className="font-display text-[var(--text-2xl)] leading-[var(--leading-tight)] text-[var(--color-text)]"
            >
              Ingredients
            </h3>

            {/* Compact controls row */}
            <div className="mt-[var(--space-md)] flex flex-wrap items-center gap-[var(--space-md)]">
              <UnitToggle />
              <ServingCalculator />
            </div>

            <IngredientList ingredients={recipe.ingredients ?? []} />
          </div>
        </RecipeInteractivePanel>

        {/* ─── Section divider ─── */}
        <div className="divider" style={{ margin: "var(--space-3xl) auto" }} />

        {/* ─── Steps ─── */}
        {recipe.steps && recipe.steps.length > 0 && (
          <div>
            <h3
              className="font-display text-[var(--text-2xl)] leading-[var(--leading-tight)] text-[var(--color-text)]"
            >
              Instructions
            </h3>
            <ol className="mt-[var(--space-xl)] space-y-[var(--space-3xl)]">
              {recipe.steps.map((step) => (
                <li key={step.id} className="flex gap-[var(--space-lg)]">
                  {/* Step number — accent color, no circle */}
                  <span
                    className="shrink-0 font-display text-[var(--text-2xl)] font-semibold leading-[var(--leading-tight)]"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {step.stepNumber}.
                  </span>
                  <div className="flex-1 pt-[var(--space-xs)]">
                    <p className="text-[var(--text-base)] leading-[var(--leading-relaxed)] text-[var(--color-text-secondary)]">
                      {step.instruction}
                    </p>
                    {step.tip && (
                      <p
                        className="mt-[var(--space-md)] text-[var(--text-sm)] italic leading-[var(--leading-relaxed)]"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Tip: {step.tip}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      {/* ─── Section divider ─── */}
      <div className="divider" />

      {/* ─── After recipe: actions ─── */}
      <section
        className="mx-auto px-[var(--space-lg)] py-[var(--space-xl)]"
        style={{ maxWidth: "var(--container-prose)" }}
      >
        <div className="flex items-center justify-between">
          <CookMode steps={recipe.steps ?? []} title={recipe.title} />
          <div className="flex items-center gap-[var(--space-xs)]">
            <ShareButtons
              url={`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/recipes/${slug}`}
              title={recipe.title}
              description={recipe.description ?? undefined}
              image={recipe.heroImage}
            />
            <BookmarkButton slug={slug} />
            <PrintButton />
          </div>
        </div>

        {/* temporarily hidden
        <div className="mt-[var(--space-2xl)]">
          <RecipeReviews
            recipeId={recipe.id}
            reviews={[]}
            stats={recipe.reviewStats ?? { averageRating: 0, totalReviews: 0 }}
          />
        </div>
        */}

        {/* ─── Tags ─── */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mt-[var(--space-2xl)] text-center">
            <div className="flex flex-wrap justify-center gap-[var(--space-sm)]">
              {recipe.tags.map((tag) => (
                <Link key={tag.id} href={`/tags/${tag.slug}`}>
                  <Badge variant="secondary">{tag.name}</Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

/* ─── RecipeHero ─── */

function RecipeHero({ recipe }: { recipe: Recipe }) {
  const placeholderColor =
    heroPlaceholderColors[recipe.id] ?? "#e8c4a0";

  if (!recipe.heroImage) {
    return null;
  }

  return (
    <section
      className="mx-auto px-[var(--space-lg)] pt-[var(--space-2xl)]"
      style={{ maxWidth: "var(--container-xl)" }}
    >
      <div className="relative aspect-[16/9] max-h-[560px] w-full overflow-hidden rounded-[var(--radius-2xl)]">
        <Image
          src={recipe.heroImage}
          alt={recipe.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}

/* ─── Jump to Recipe ─── */

function JumpToRecipe() {
  return (
    <div className="no-print fixed bottom-[var(--space-lg)] left-1/2 z-[var(--z-sticky)] -translate-x-1/2 md:hidden">
      <a
        href="#recipe"
        className={cn(
          "inline-flex items-center gap-[var(--space-sm)] rounded-[var(--radius-full)]",
          "px-[var(--space-xl)] py-[var(--space-sm)]",
          "text-[var(--text-sm)] font-medium text-white",
          "shadow-[var(--shadow-md)]",
          "transition-transform duration-[var(--transition-fast)]",
          "hover:scale-105 active:scale-95"
        )}
        style={{ backgroundColor: "var(--color-accent)" }}
      >
        <ArrowDown className="size-4" />
        Jump to Recipe
      </a>
    </div>
  );
}

/* ─── Helpers ─── */

function groupIngredients(
  ingredients: Ingredient[]
): { groupName: string | null; items: Ingredient[] }[] {
  const map = new Map<string | null, Ingredient[]>();
  for (const ing of ingredients) {
    const key = ing.groupName;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(ing);
  }
  return Array.from(map.entries()).map(([groupName, items]) => ({
    groupName,
    items: items.sort((a, b) => a.sortOrder - b.sortOrder),
  }));
}

function formatQuantity(qty: number): string {
  if (qty === 0.25) return "\u00BC";
  if (qty === 0.5) return "\u00BD";
  if (qty === 0.75) return "\u00BE";
  if (qty === 0.33 || qty === 0.333) return "\u2153";
  if (qty === 0.67 || qty === 0.667) return "\u2154";
  if (Number.isInteger(qty)) return String(qty);
  // Mixed number
  const whole = Math.floor(qty);
  const frac = qty - whole;
  if (whole > 0 && frac > 0) {
    return `${whole} ${formatQuantity(frac)}`;
  }
  return String(qty);
}
