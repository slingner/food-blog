"use server";

import { db } from "./index";
import {
  recipes,
  categories,
  ingredients,
  steps,
  recipeImages,
  reviews,
  tags,
  recipeTags,
  newsletterSubscribers,
} from "./schema";
import { eq, and, desc, asc, sql, ilike, or } from "drizzle-orm";
import type { Recipe, Category, ReviewStats } from "@/lib/types";

// ─── Public queries ───

export async function getPublishedRecipes(options?: {
  limit?: number;
  offset?: number;
  categorySlug?: string;
  difficulty?: string;
  search?: string;
}) {
  const { limit = 12, offset = 0, categorySlug, difficulty, search } = options ?? {};

  const conditions = [eq(recipes.published, true)];

  if (difficulty) {
    conditions.push(eq(recipes.difficulty, difficulty));
  }

  let query = db
    .select({
      id: recipes.id,
      title: recipes.title,
      slug: recipes.slug,
      description: recipes.description,
      heroImage: recipes.heroImage,
      prepTime: recipes.prepTime,
      cookTime: recipes.cookTime,
      servings: recipes.servings,
      difficulty: recipes.difficulty,
      featured: recipes.featured,
      createdAt: recipes.createdAt,
      categoryId: recipes.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(recipes)
    .leftJoin(categories, eq(recipes.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(desc(recipes.createdAt))
    .limit(limit)
    .offset(offset);

  if (categorySlug) {
    conditions.push(eq(categories.slug, categorySlug));
  }

  if (search) {
    conditions.push(
      or(
        ilike(recipes.title, `%${search}%`),
        ilike(recipes.description, `%${search}%`)
      )!
    );
  }

  const rows = await db
    .select({
      id: recipes.id,
      title: recipes.title,
      slug: recipes.slug,
      description: recipes.description,
      heroImage: recipes.heroImage,
      prepTime: recipes.prepTime,
      cookTime: recipes.cookTime,
      servings: recipes.servings,
      difficulty: recipes.difficulty,
      featured: recipes.featured,
      createdAt: recipes.createdAt,
      categoryId: recipes.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(recipes)
    .leftJoin(categories, eq(recipes.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(desc(recipes.createdAt))
    .limit(limit)
    .offset(offset);

  return rows;
}

export async function getRecipeBySlug(slug: string) {
  const [recipe] = await db
    .select()
    .from(recipes)
    .where(and(eq(recipes.slug, slug), eq(recipes.published, true)))
    .limit(1);

  if (!recipe) return null;

  const [recipeIngredients, recipeSteps, recipeImgs, category, reviewStats] =
    await Promise.all([
      db
        .select()
        .from(ingredients)
        .where(eq(ingredients.recipeId, recipe.id))
        .orderBy(asc(ingredients.sortOrder)),
      db
        .select()
        .from(steps)
        .where(eq(steps.recipeId, recipe.id))
        .orderBy(asc(steps.stepNumber)),
      db
        .select()
        .from(recipeImages)
        .where(eq(recipeImages.recipeId, recipe.id))
        .orderBy(asc(recipeImages.sortOrder)),
      recipe.categoryId
        ? db
            .select()
            .from(categories)
            .where(eq(categories.id, recipe.categoryId))
            .then((rows) => rows[0] ?? null)
        : Promise.resolve(null),
      getReviewStats(recipe.id),
    ]);

  return {
    ...recipe,
    ingredients: recipeIngredients,
    steps: recipeSteps,
    images: recipeImgs,
    category,
    reviewStats,
  };
}

export async function getFeaturedRecipes(limit = 4) {
  return db
    .select({
      id: recipes.id,
      title: recipes.title,
      slug: recipes.slug,
      description: recipes.description,
      heroImage: recipes.heroImage,
      prepTime: recipes.prepTime,
      cookTime: recipes.cookTime,
      servings: recipes.servings,
      difficulty: recipes.difficulty,
      featured: recipes.featured,
      createdAt: recipes.createdAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(recipes)
    .leftJoin(categories, eq(recipes.categoryId, categories.id))
    .where(and(eq(recipes.published, true), eq(recipes.featured, true)))
    .orderBy(desc(recipes.createdAt))
    .limit(limit);
}

export async function getRecipesByCategory(categorySlug: string, limit = 12) {
  return db
    .select({
      id: recipes.id,
      title: recipes.title,
      slug: recipes.slug,
      description: recipes.description,
      heroImage: recipes.heroImage,
      prepTime: recipes.prepTime,
      cookTime: recipes.cookTime,
      servings: recipes.servings,
      difficulty: recipes.difficulty,
      createdAt: recipes.createdAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(recipes)
    .innerJoin(categories, eq(recipes.categoryId, categories.id))
    .where(and(eq(categories.slug, categorySlug), eq(recipes.published, true)))
    .orderBy(desc(recipes.createdAt))
    .limit(limit);
}

// ─── Categories ───

export async function getCategories() {
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name));

  // Build tree structure
  const topLevel = allCategories.filter((c) => !c.parentId);
  return topLevel.map((parent) => ({
    ...parent,
    children: allCategories.filter((c) => c.parentId === parent.id),
  }));
}

export async function getCategoryBySlug(slug: string) {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return category ?? null;
}

// ─── Search ───

export async function searchRecipes(query: string, limit = 20) {
  if (!query.trim()) return [];

  return db
    .select({
      id: recipes.id,
      title: recipes.title,
      slug: recipes.slug,
      description: recipes.description,
      heroImage: recipes.heroImage,
      prepTime: recipes.prepTime,
      cookTime: recipes.cookTime,
      categoryName: categories.name,
    })
    .from(recipes)
    .leftJoin(categories, eq(recipes.categoryId, categories.id))
    .where(
      and(
        eq(recipes.published, true),
        or(
          ilike(recipes.title, `%${query}%`),
          ilike(recipes.description, `%${query}%`)
        )
      )
    )
    .orderBy(desc(recipes.createdAt))
    .limit(limit);
}

// ─── Reviews ───

export async function getRecipeReviews(recipeId: number) {
  return db
    .select()
    .from(reviews)
    .where(and(eq(reviews.recipeId, recipeId), eq(reviews.approved, true)))
    .orderBy(desc(reviews.createdAt));
}

export async function getReviewStats(recipeId: number): Promise<ReviewStats> {
  const [result] = await db
    .select({
      averageRating: sql<number>`coalesce(avg(${reviews.rating}), 0)`,
      totalReviews: sql<number>`count(*)`,
    })
    .from(reviews)
    .where(and(eq(reviews.recipeId, recipeId), eq(reviews.approved, true)));

  return {
    averageRating: Number(result?.averageRating ?? 0),
    totalReviews: Number(result?.totalReviews ?? 0),
  };
}

export async function getPendingReviews() {
  return db
    .select({
      id: reviews.id,
      recipeId: reviews.recipeId,
      recipeTitle: recipes.title,
      name: reviews.name,
      email: reviews.email,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .innerJoin(recipes, eq(reviews.recipeId, recipes.id))
    .where(eq(reviews.approved, false))
    .orderBy(desc(reviews.createdAt));
}

// ─── Newsletter ───

export async function getSubscribers() {
  return db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.subscribed, true))
    .orderBy(desc(newsletterSubscribers.createdAt));
}

export async function getSubscriberCount() {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.subscribed, true));
  return Number(result?.count ?? 0);
}

// ─── Admin queries ───

export async function getAllRecipesAdmin() {
  return db
    .select({
      id: recipes.id,
      title: recipes.title,
      slug: recipes.slug,
      published: recipes.published,
      featured: recipes.featured,
      createdAt: recipes.createdAt,
      updatedAt: recipes.updatedAt,
      categoryName: categories.name,
    })
    .from(recipes)
    .leftJoin(categories, eq(recipes.categoryId, categories.id))
    .orderBy(desc(recipes.updatedAt));
}

export async function getRecipeByIdAdmin(id: number) {
  const [recipe] = await db
    .select()
    .from(recipes)
    .where(eq(recipes.id, id))
    .limit(1);

  if (!recipe) return null;

  const [recipeIngredients, recipeSteps, recipeImgs] = await Promise.all([
    db
      .select()
      .from(ingredients)
      .where(eq(ingredients.recipeId, recipe.id))
      .orderBy(asc(ingredients.sortOrder)),
    db
      .select()
      .from(steps)
      .where(eq(steps.recipeId, recipe.id))
      .orderBy(asc(steps.stepNumber)),
    db
      .select()
      .from(recipeImages)
      .where(eq(recipeImages.recipeId, recipe.id))
      .orderBy(asc(recipeImages.sortOrder)),
  ]);

  return {
    ...recipe,
    ingredients: recipeIngredients,
    steps: recipeSteps,
    images: recipeImgs,
  };
}

// ─── Stats (admin dashboard) ───

export async function getAdminStats() {
  const [recipeCount, reviewCount, subscriberCount] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(recipes)
      .then((r) => Number(r[0]?.count ?? 0)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(eq(reviews.approved, false))
      .then((r) => Number(r[0]?.count ?? 0)),
    getSubscriberCount(),
  ]);

  return {
    totalRecipes: recipeCount,
    pendingReviews: reviewCount,
    subscribers: subscriberCount,
  };
}
