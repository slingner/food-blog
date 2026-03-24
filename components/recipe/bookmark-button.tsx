"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, Printer } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "bookmarked-recipes";

function getBookmarks(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveBookmarks(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
}

export function BookmarkButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(getBookmarks().has(slug));
  }, [slug]);

  const toggle = useCallback(() => {
    const set = getBookmarks();
    if (set.has(slug)) {
      set.delete(slug);
      setSaved(false);
    } else {
      set.add(slug);
      setSaved(true);
    }
    saveBookmarks(set);
  }, [slug]);

  return (
    <button
      onClick={toggle}
      className={cn(
        "p-2 rounded-xl transition-all duration-[var(--transition-fast)]",
        saved
          ? "text-rose-500 hover:bg-rose-50"
          : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-secondary)]"
      )}
      aria-label={saved ? "Remove bookmark" : "Bookmark recipe"}
      aria-pressed={saved}
    >
      <Heart className={cn("size-5", saved && "fill-current")} />
    </button>
  );
}

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className={cn(
        "p-2 rounded-xl",
        "text-[var(--color-text-muted)]",
        "hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-secondary)]",
        "transition-all duration-[var(--transition-fast)]"
      )}
      aria-label="Print recipe"
    >
      <Printer className="size-5" />
    </button>
  );
}
