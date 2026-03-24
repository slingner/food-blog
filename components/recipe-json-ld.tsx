import type { Recipe } from "@/lib/types";

function minutesToIsoDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `PT${hours}H${mins}M`;
  if (hours > 0) return `PT${hours}H`;
  return `PT${mins}M`;
}

export function RecipeJsonLd({ recipe }: { recipe: Recipe }) {
  const totalTime =
    (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0) + (recipe.restTime ?? 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description ?? undefined,
    image: recipe.heroImage ?? undefined,
    datePublished: recipe.createdAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "The Hungry Fork",
    },
    ...(recipe.prepTime && {
      prepTime: minutesToIsoDuration(recipe.prepTime),
    }),
    ...(recipe.cookTime && {
      cookTime: minutesToIsoDuration(recipe.cookTime),
    }),
    ...(totalTime > 0 && { totalTime: minutesToIsoDuration(totalTime) }),
    recipeYield: `${recipe.servings} servings`,
    ...(recipe.category && { recipeCategory: recipe.category.name }),
    ...(recipe.ingredients &&
      recipe.ingredients.length > 0 && {
        recipeIngredient: recipe.ingredients.map((ing) => {
          const parts: string[] = [];
          if (ing.quantity) parts.push(String(ing.quantity));
          if (ing.unitUs) parts.push(ing.unitUs);
          parts.push(ing.name);
          if (ing.note) parts.push(`(${ing.note})`);
          return parts.join(" ");
        }),
      }),
    ...(recipe.steps &&
      recipe.steps.length > 0 && {
        recipeInstructions: recipe.steps.map((step) => ({
          "@type": "HowToStep",
          position: step.stepNumber,
          text: step.instruction,
        })),
      }),
    ...(recipe.reviewStats &&
      recipe.reviewStats.totalReviews > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: recipe.reviewStats.averageRating,
          reviewCount: recipe.reviewStats.totalReviews,
        },
      }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
