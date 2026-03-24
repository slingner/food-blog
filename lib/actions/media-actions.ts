"use server";

import { put, del } from "@vercel/blob";

export async function uploadMedia(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  const blob = await put(file.name, file, {
    access: "public",
  });

  return { success: true, url: blob.url };
}

export async function deleteMedia(url: string) {
  await del(url);
  return { success: true };
}
