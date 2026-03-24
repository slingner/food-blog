import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { formatMinutes } from "@/lib/utils";
import { getMockRecipeBySlug, mockRecipes } from "@/lib/mock-data";

import { PrintButton } from "./print-button";

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
    title: `Print: ${recipe.title}`,
    robots: { index: false },
  };
}

/* ─── Page ─── */

export default async function PrintRecipePage({
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
  const ingredientGroups = new Map<string | null, typeof recipe.ingredients>();
  for (const ing of recipe.ingredients ?? []) {
    const key = ing.groupName;
    if (!ingredientGroups.has(key)) ingredientGroups.set(key, []);
    ingredientGroups.get(key)!.push(ing);
  }

  return (
    <div className="mx-auto max-w-[680px] px-6 py-8 font-sans text-black print:px-0 print:py-0">
      {/* Print button (hidden when printing) */}
      <div className="mb-8 no-print">
        <PrintButton />
      </div>

      {/* Title */}
      <h1 className="font-display text-3xl font-bold leading-tight">
        {recipe.title}
      </h1>

      {recipe.description && (
        <p className="mt-2 text-sm text-gray-600">{recipe.description}</p>
      )}

      {/* Time info */}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-y border-gray-300 py-3 text-sm">
        {recipe.prepTime != null && recipe.prepTime > 0 && (
          <span>
            <strong>Prep:</strong> {formatMinutes(recipe.prepTime)}
          </span>
        )}
        {recipe.cookTime != null && recipe.cookTime > 0 && (
          <span>
            <strong>Cook:</strong> {formatMinutes(recipe.cookTime)}
          </span>
        )}
        {recipe.restTime != null && recipe.restTime > 0 && (
          <span>
            <strong>Rest:</strong> {formatMinutes(recipe.restTime)}
          </span>
        )}
        {totalTime > 0 && (
          <span>
            <strong>Total:</strong> {formatMinutes(totalTime)}
          </span>
        )}
        <span>
          <strong>Servings:</strong> {recipe.servings}
        </span>
      </div>

      {/* Ingredients */}
      <h2 className="mt-6 font-display text-xl font-bold">Ingredients</h2>
      {Array.from(ingredientGroups.entries()).map(([groupName, items]) => (
        <div key={groupName ?? "__default"} className="mt-3">
          {groupName && (
            <h3 className="mb-1 text-sm font-semibold italic">{groupName}</h3>
          )}
          <ul className="list-disc pl-5 text-sm leading-relaxed">
            {items!
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((ing) => (
                <li key={ing.id}>
                  {ing.quantity != null && (
                    <strong>
                      {ing.quantity} {ing.unitUs ? `${ing.unitUs} ` : ""}
                    </strong>
                  )}
                  {ing.name}
                  {ing.note && (
                    <span className="text-gray-500"> ({ing.note})</span>
                  )}
                </li>
              ))}
          </ul>
        </div>
      ))}

      {/* Steps */}
      {recipe.steps && recipe.steps.length > 0 && (
        <>
          <h2 className="mt-6 font-display text-xl font-bold">Instructions</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-relaxed">
            {recipe.steps.map((step) => (
              <li key={step.id}>
                {step.instruction}
                {step.tip && (
                  <p className="mt-1 text-xs italic text-gray-500">
                    Tip: {step.tip}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </>
      )}

      {/* Attribution */}
      <footer className="mt-10 border-t border-gray-300 pt-4 text-center text-xs text-gray-400">
        thehungryfork.com
      </footer>
    </div>
  );
}
