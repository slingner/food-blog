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

const iconBtnClass = cn(
  "inline-flex items-center justify-center size-9 rounded-full",
  "transition-colors duration-[var(--transition-fast)]"
);

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
        iconBtnClass,
        saved
          ? "text-[var(--color-accent)]"
          : "text-[var(--color-text-faint)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)]"
      )}
      aria-label={saved ? "Remove bookmark" : "Bookmark recipe"}
      aria-pressed={saved}
    >
      <Heart className={cn("size-[18px]", saved && "fill-current")} strokeWidth={1.5} />
    </button>
  );
}

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className={cn(
        iconBtnClass,
        "text-[var(--color-text-faint)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)]"
      )}
      aria-label="Print recipe"
    >
      <Printer className="size-[18px]" strokeWidth={1.5} />
    </button>
  );
}
