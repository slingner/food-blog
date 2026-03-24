"use server";

import { db } from "@/lib/db";
import { recipes, ingredients, steps, recipeImages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { RecipeFormData } from "@/lib/types";

export async function createRecipe(data: RecipeFormData) {
  const [recipe] = await db
    .insert(recipes)
    .values({
      title: data.title,
      slug: data.slug,
      description: data.description,
      introHtml: data.introHtml,
      heroImage: data.heroImage,
      heroVideo: data.heroVideo,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      restTime: data.restTime,
      servings: data.servings,
      difficulty: data.difficulty,
      published: data.published,
      featured: data.featured,
      categoryId: data.categoryId,
    })
    .returning();

  if (data.ingredients.length > 0) {
    await db.insert(ingredients).values(
      data.ingredients.map((ing) => ({
        recipeId: recipe.id,
        groupName: ing.groupName,
        name: ing.name,
        quantity: ing.quantity?.toString() ?? null,
        unitUs: ing.unitUs,
        unitMetric: ing.unitMetric,
        quantityMetric: ing.quantityMetric?.toString() ?? null,
        note: ing.note,
        sortOrder: ing.sortOrder,
      }))
    );
  }

  if (data.steps.length > 0) {
    await db.insert(steps).values(
      data.steps.map((step) => ({
        recipeId: recipe.id,
        stepNumber: step.stepNumber,
        instruction: step.instruction,
        imageUrl: step.imageUrl,
        tip: step.tip,
      }))
    );
  }

  revalidatePath("/");
  revalidatePath("/recipes");
  revalidatePath("/admin/recipes");

  return recipe;
}

export async function updateRecipe(id: number, data: RecipeFormData) {
  await db
    .update(recipes)
    .set({
      title: data.title,
      slug: data.slug,
      description: data.description,
      introHtml: data.introHtml,
      heroImage: data.heroImage,
      heroVideo: data.heroVideo,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      restTime: data.restTime,
      servings: data.servings,
      difficulty: data.difficulty,
      published: data.published,
      featured: data.featured,
      categoryId: data.categoryId,
      updatedAt: new Date(),
    })
    .where(eq(recipes.id, id));

  // Replace ingredients
  await db.delete(ingredients).where(eq(ingredients.recipeId, id));
  if (data.ingredients.length > 0) {
    await db.insert(ingredients).values(
      data.ingredients.map((ing) => ({
        recipeId: id,
        groupName: ing.groupName,
        name: ing.name,
        quantity: ing.quantity?.toString() ?? null,
        unitUs: ing.unitUs,
        unitMetric: ing.unitMetric,
        quantityMetric: ing.quantityMetric?.toString() ?? null,
        note: ing.note,
        sortOrder: ing.sortOrder,
      }))
    );
  }

  // Replace steps
  await db.delete(steps).where(eq(steps.recipeId, id));
  if (data.steps.length > 0) {
    await db.insert(steps).values(
      data.steps.map((step) => ({
        recipeId: id,
        stepNumber: step.stepNumber,
        instruction: step.instruction,
        imageUrl: step.imageUrl,
        tip: step.tip,
      }))
    );
  }

  revalidatePath("/");
  revalidatePath("/recipes");
  revalidatePath(`/recipes/${data.slug}`);
  revalidatePath("/admin/recipes");

  return { success: true };
}

export async function deleteRecipe(id: number) {
  await db.delete(recipes).where(eq(recipes.id, id));

  revalidatePath("/");
  revalidatePath("/recipes");
  revalidatePath("/admin/recipes");

  return { success: true };
}

export async function togglePublished(id: number) {
  const [recipe] = await db
    .select({ published: recipes.published })
    .from(recipes)
    .where(eq(recipes.id, id))
    .limit(1);

  if (!recipe) return { success: false };

  await db
    .update(recipes)
    .set({ published: !recipe.published, updatedAt: new Date() })
    .where(eq(recipes.id, id));

  revalidatePath("/");
  revalidatePath("/recipes");
  revalidatePath("/admin/recipes");

  return { success: true, published: !recipe.published };
}
