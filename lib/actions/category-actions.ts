"use server";

import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  parentId?: number | null;
  sortOrder?: number;
}) {
  const [category] = await db
    .insert(categories)
    .values({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      parentId: data.parentId || null,
      sortOrder: data.sortOrder ?? 0,
    })
    .returning();

  revalidatePath("/admin/categories");
  revalidatePath("/");

  return category;
}

export async function updateCategory(
  id: number,
  data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: number | null;
    sortOrder?: number;
  }
) {
  await db
    .update(categories)
    .set({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      parentId: data.parentId || null,
      sortOrder: data.sortOrder ?? 0,
    })
    .where(eq(categories.id, id));

  revalidatePath("/admin/categories");
  revalidatePath("/");

  return { success: true };
}

export async function deleteCategory(id: number) {
  // Move child categories to top level
  await db
    .update(categories)
    .set({ parentId: null })
    .where(eq(categories.parentId, id));

  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath("/admin/categories");
  revalidatePath("/");

  return { success: true };
}
