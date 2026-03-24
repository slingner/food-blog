"use server";

import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ReviewFormData } from "@/lib/types";

export async function submitReview(data: ReviewFormData) {
  // Basic validation
  if (!data.name?.trim()) return { error: "Name is required" };
  if (!data.email?.trim()) return { error: "Email is required" };
  if (!data.rating || data.rating < 1 || data.rating > 5)
    return { error: "Rating must be between 1 and 5" };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) return { error: "Invalid email address" };

  await db.insert(reviews).values({
    recipeId: data.recipeId,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    rating: data.rating,
    comment: data.comment?.trim() || null,
    approved: false,
  });

  return { success: true, message: "Review submitted for moderation" };
}

export async function approveReview(id: number) {
  const [review] = await db
    .select({ recipeId: reviews.recipeId })
    .from(reviews)
    .where(eq(reviews.id, id))
    .limit(1);

  await db.update(reviews).set({ approved: true }).where(eq(reviews.id, id));

  if (review) {
    revalidatePath(`/recipes`);
  }
  revalidatePath("/admin/reviews");

  return { success: true };
}

export async function deleteReview(id: number) {
  await db.delete(reviews).where(eq(reviews.id, id));

  revalidatePath("/admin/reviews");

  return { success: true };
}
