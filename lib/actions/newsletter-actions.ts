"use server";

import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getResend } from "@/lib/resend";

export async function subscribe(email: string, name?: string) {
  if (!email?.trim()) return { error: "Email is required" };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { error: "Invalid email address" };

  const normalizedEmail = email.trim().toLowerCase();

  // Check if already subscribed
  const [existing] = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, normalizedEmail))
    .limit(1);

  if (existing) {
    if (existing.subscribed) {
      return { error: "You're already subscribed!" };
    }
    // Re-subscribe
    await db
      .update(newsletterSubscribers)
      .set({ subscribed: true })
      .where(eq(newsletterSubscribers.id, existing.id));
  } else {
    await db.insert(newsletterSubscribers).values({
      email: normalizedEmail,
      name: name?.trim() || null,
    });
  }

  // Send welcome email
  try {
    const resend = getResend();
    await resend.emails.send({
      from: "Food Blog <noreply@yourdomain.com>",
      to: normalizedEmail,
      subject: "Welcome to our newsletter!",
      html: `
        <h1>Welcome to Food Blog!</h1>
        <p>Thanks for subscribing${name ? `, ${name}` : ""}! You'll receive our latest recipes and cooking tips straight to your inbox.</p>
        <p>Happy cooking!</p>
      `,
    });
  } catch {
    // Don't fail the subscription if email fails
    console.error("Failed to send welcome email");
  }

  revalidatePath("/admin/newsletter");

  return { success: true, message: "Welcome! You're now subscribed." };
}

export async function unsubscribe(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  await db
    .update(newsletterSubscribers)
    .set({ subscribed: false })
    .where(eq(newsletterSubscribers.email, normalizedEmail));

  revalidatePath("/admin/newsletter");

  return { success: true };
}
