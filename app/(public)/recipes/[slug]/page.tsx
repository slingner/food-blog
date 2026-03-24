import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Flame,
  Timer,
  Users,
  ChefHat,
  ArrowDown,
  Printer,
  Lightbulb,
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

  return (
    <>
      <RecipeJsonLd recipe={recipe} />

      {/* ─── Hero ─── */}
      <RecipeHero recipe={recipe} />

      {/* ─── Time / Serving bar ─── */}
      <TimeServingBar recipe={recipe} totalTime={totalTime} />

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

      {/* ─── Recipe Card ─── */}
      <section
        id="recipe"
        className="mx-auto px-[var(--space-lg)] pb-[var(--space-4xl)]"
        style={{ maxWidth: "var(--container-prose)" }}
      >
        <div
          className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-2xl)] shadow-[var(--shadow-md)]"
        >
          {/* Card header */}
          <h2
            className="font-display text-[var(--text-3xl)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]"
          >
            {recipe.title}
          </h2>
          {recipe.description && (
            <p className="mt-[var(--space-sm)] text-[var(--text-base)] text-[var(--color-text-muted)]">
              {recipe.description}
            </p>
          )}

          {/* Stream D placeholders */}
          <div className="mt-[var(--space-xl)] flex flex-wrap items-center gap-[var(--space-md)]">
            {/* ServingCalculator placeholder */}
            <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] px-[var(--space-md)] py-[var(--space-sm)] text-[var(--text-sm)] text-[var(--color-text-faint)]">
              ServingCalculator placeholder
            </div>
            {/* UnitToggle placeholder */}
            <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] px-[var(--space-md)] py-[var(--space-sm)] text-[var(--text-sm)] text-[var(--color-text-faint)]">
              UnitToggle placeholder
            </div>
          </div>

          {/* ─── Ingredients ─── */}
          <div className="mt-[var(--space-2xl)]">
            <h3
              className="font-display text-[var(--text-2xl)] leading-[var(--leading-tight)] text-[var(--color-text)]"
            >
              Ingredients
            </h3>

            {/* IngredientList interactive placeholder */}
            <div className="mt-[var(--space-sm)] rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] px-[var(--space-md)] py-[var(--space-sm)] text-[var(--text-sm)] text-[var(--color-text-faint)]">
              IngredientList interactive placeholder
            </div>

            <div className="mt-[var(--space-lg)] space-y-[var(--space-xl)]">
              {ingredientGroups.map(({ groupName, items }) => (
                <div key={groupName ?? "__default"}>
                  {groupName && (
                    <h4
                      className="mb-[var(--space-sm)] font-display text-[var(--text-lg)] italic text-[var(--color-text-secondary)]"
                    >
                      {groupName}
                    </h4>
                  )}
                  <ul className="space-y-[var(--space-sm)]">
                    {items.map((ing) => (
                      <li key={ing.id} className="flex items-start gap-[var(--space-sm)]">
                        {/* Checkbox style */}
                        <span
                          className="mt-[3px] flex size-[18px] shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)]"
                          aria-hidden="true"
                        />
                        <span className="text-[var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-text-secondary)]">
                          {ing.quantity != null && (
                            <span className="font-medium text-[var(--color-text)]">
                              {formatQuantity(ing.quantity)}{" "}
                            </span>
                          )}
                          {ing.unitUs && (
                            <span className="text-[var(--color-text)]">
                              {ing.unitUs}{" "}
                            </span>
                          )}
                          <span>{ing.name}</span>
                          {ing.note && (
                            <span className="text-[var(--color-text-muted)]">
                              {" "}
                              ({ing.note})
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Steps ─── */}
          {recipe.steps && recipe.steps.length > 0 && (
            <div className="mt-[var(--space-2xl)]">
              <h3
                className="font-display text-[var(--text-2xl)] leading-[var(--leading-tight)] text-[var(--color-text)]"
              >
                Instructions
              </h3>
              <ol className="mt-[var(--space-lg)] space-y-[var(--space-2xl)]">
                {recipe.steps.map((step) => (
                  <li key={step.id} className="flex gap-[var(--space-lg)]">
                    {/* Step number circle */}
                    <span
                      className="flex size-9 shrink-0 items-center justify-center rounded-full font-display text-[var(--text-base)] font-semibold"
                      style={{
                        backgroundColor: "var(--color-accent-light)",
                        color: "var(--color-accent)",
                      }}
                    >
                      {step.stepNumber}
                    </span>
                    <div className="flex-1 pt-[var(--space-xs)]">
                      <p className="text-[var(--text-base)] leading-[var(--leading-relaxed)] text-[var(--color-text-secondary)]">
                        {step.instruction}
                      </p>
                      {step.tip && (
                        <div
                          className="mt-[var(--space-md)] flex gap-[var(--space-sm)] rounded-[var(--radius-md)] p-[var(--space-md)]"
                          style={{
                            backgroundColor: "var(--color-accent-light)",
                            borderLeft: "3px solid var(--color-accent)",
                          }}
                        >
                          <Lightbulb
                            className="mt-0.5 size-4 shrink-0"
                            style={{ color: "var(--color-accent)" }}
                          />
                          <p className="text-[var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-text-secondary)]">
                            <span
                              className="font-semibold"
                              style={{ color: "var(--color-accent)" }}
                            >
                              Tip:{" "}
                            </span>
                            {step.tip}
                          </p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </section>

      {/* ─── After recipe card: action placeholders ─── */}
      <section
        className="mx-auto px-[var(--space-lg)] pb-[var(--space-2xl)]"
        style={{ maxWidth: "var(--container-prose)" }}
      >
        <div className="flex flex-wrap items-center gap-[var(--space-md)]">
          {/* CookMode placeholder */}
          <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] px-[var(--space-md)] py-[var(--space-sm)] text-[var(--text-sm)] text-[var(--color-text-faint)]">
            CookMode placeholder
          </div>
          {/* ShareButtons placeholder */}
          <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] px-[var(--space-md)] py-[var(--space-sm)] text-[var(--text-sm)] text-[var(--color-text-faint)]">
            ShareButtons placeholder
          </div>
          {/* BookmarkButton placeholder */}
          <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] px-[var(--space-md)] py-[var(--space-sm)] text-[var(--text-sm)] text-[var(--color-text-faint)]">
            BookmarkButton placeholder
          </div>
          {/* PrintButton */}
          <Link
            href={`/recipes/${slug}/print`}
            className={cn(
              "inline-flex items-center gap-[var(--space-sm)] rounded-[var(--radius-md)]",
              "border border-[var(--color-border)] px-[var(--space-md)] py-[var(--space-sm)]",
              "text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)]",
              "transition-[color,background-color] duration-[var(--transition-fast)]",
              "hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]"
            )}
          >
            <Printer className="size-4" />
            Print
          </Link>
        </div>

        {/* RecipeReviews placeholder */}
        <div className="mt-[var(--space-2xl)] rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] px-[var(--space-lg)] py-[var(--space-xl)] text-center text-[var(--text-sm)] text-[var(--color-text-faint)]">
          RecipeReviews placeholder
        </div>

        {/* ─── Tags ─── */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mt-[var(--space-2xl)]">
            <h3 className="text-[var(--text-sm)] font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--color-text-muted)]">
              Tags
            </h3>
            <div className="mt-[var(--space-md)] flex flex-wrap gap-[var(--space-sm)]">
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

  return (
    <section className="relative">
      {recipe.heroImage ? (
        <div className="relative aspect-[16/9] max-h-[560px] w-full overflow-hidden">
          <Image
            src={recipe.heroImage}
            alt={recipe.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-[var(--space-2xl)] md:p-[var(--space-4xl)]">
            <HeroContent recipe={recipe} textColor="white" />
          </div>
        </div>
      ) : (
        <div
          className="w-full px-[var(--space-lg)] pb-[var(--space-3xl)] pt-[var(--space-4xl)]"
          style={{ backgroundColor: placeholderColor }}
        >
          <div className="mx-auto" style={{ maxWidth: "var(--container-prose)" }}>
            <HeroContent
              recipe={recipe}
              textColor="white"
            />
          </div>
        </div>
      )}
    </section>
  );
}

function HeroContent({
  recipe,
  textColor,
}: {
  recipe: Recipe;
  textColor: string;
}) {
  return (
    <div>
      {/* Breadcrumb */}
      {recipe.category && (
        <nav aria-label="Breadcrumb" className="mb-[var(--space-md)]">
          <ol className="flex items-center gap-[var(--space-xs)] text-[var(--text-sm)]">
            <li>
              <Link
                href="/recipes"
                className="opacity-70 transition-opacity hover:opacity-100"
                style={{ color: textColor }}
              >
                Recipes
              </Link>
            </li>
            <li style={{ color: textColor }} className="opacity-50">
              /
            </li>
            <li>
              <Link
                href={`/category/${recipe.category.slug}`}
                className="opacity-70 transition-opacity hover:opacity-100"
                style={{ color: textColor }}
              >
                {recipe.category.name}
              </Link>
            </li>
          </ol>
        </nav>
      )}

      {/* Title */}
      <h1
        className="font-display text-[var(--text-4xl)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] md:text-[var(--text-5xl)]"
        style={{ color: textColor }}
      >
        {recipe.title}
      </h1>

      {/* Meta line */}
      <div className="mt-[var(--space-lg)] flex flex-wrap items-center gap-[var(--space-md)]">
        <span
          className="text-[var(--text-sm)] font-medium"
          style={{ color: textColor, opacity: 0.85 }}
        >
          The Hungry Fork Test Kitchen
        </span>
        <span style={{ color: textColor, opacity: 0.4 }}>|</span>
        <span
          className="text-[var(--text-sm)]"
          style={{ color: textColor, opacity: 0.7 }}
        >
          {formatDate(recipe.createdAt)}
        </span>
        {recipe.reviewStats && recipe.reviewStats.totalReviews > 0 && (
          <>
            <span style={{ color: textColor, opacity: 0.4 }}>|</span>
            <StarRating
              rating={recipe.reviewStats.averageRating}
              count={recipe.reviewStats.totalReviews}
            />
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Time / Serving bar ─── */

function TimeServingBar({
  recipe,
  totalTime,
}: {
  recipe: Recipe;
  totalTime: number;
}) {
  const items: { icon: React.ReactNode; label: string; value: string }[] = [];

  if (recipe.prepTime) {
    items.push({
      icon: <Clock className="size-[18px]" />,
      label: "Prep",
      value: formatMinutes(recipe.prepTime),
    });
  }
  if (recipe.cookTime) {
    items.push({
      icon: <Flame className="size-[18px]" />,
      label: "Cook",
      value: formatMinutes(recipe.cookTime),
    });
  }
  if (recipe.restTime) {
    items.push({
      icon: <Timer className="size-[18px]" />,
      label: "Rest",
      value: formatMinutes(recipe.restTime),
    });
  }
  if (totalTime > 0) {
    items.push({
      icon: <Clock className="size-[18px]" />,
      label: "Total",
      value: formatMinutes(totalTime),
    });
  }
  items.push({
    icon: <Users className="size-[18px]" />,
    label: "Servings",
    value: String(recipe.servings),
  });
  if (recipe.difficulty) {
    items.push({
      icon: <ChefHat className="size-[18px]" />,
      label: "Difficulty",
      value: recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1),
    });
  }

  return (
    <div
      className="border-y border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div
        className="mx-auto flex flex-wrap items-center justify-center gap-[var(--space-xl)] px-[var(--space-lg)] py-[var(--space-xl)] md:gap-[var(--space-2xl)]"
        style={{ maxWidth: "var(--container-prose)" }}
      >
        {items.map((item, i) => (
          <div
            key={item.label}
            className={cn(
              "flex flex-col items-center gap-[var(--space-xs)] text-center",
              i < items.length - 1 &&
                "border-r border-[var(--color-border-subtle)] pr-[var(--space-xl)] md:pr-[var(--space-2xl)]"
            )}
          >
            <span style={{ color: "var(--color-accent)" }}>{item.icon}</span>
            <span className="text-[var(--text-xs)] font-medium uppercase tracking-[var(--tracking-wide)] text-[var(--color-text-muted)]">
              {item.label}
            </span>
            <span className="text-[var(--text-base)] font-semibold text-[var(--color-text)]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
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
          "text-[var(--text-sm)] font-semibold text-white",
          "shadow-[var(--shadow-lg)]",
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
