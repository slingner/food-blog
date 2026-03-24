"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type KeyboardEvent,
} from "react";
import { Search, X, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchResult = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  heroImage: string | null;
  prepTime: number | null;
  cookTime: number | null;
  categoryName: string | null;
};

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
    }
  }, [open]);

  // Debounced search
  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data);
        setActiveIndex(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
  }, []);

  function handleInputChange(value: string) {
    setQuery(value);
    search(value);
  }

  function navigate(slug: string) {
    setOpen(false);
    window.location.href = `/recipes/${slug}`;
  }

  function onKeyDownInput(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      navigate(results[activeIndex].slug);
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.children[activeIndex] as HTMLElement;
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2",
          "bg-[var(--color-surface-raised)] text-[var(--color-text-muted)]",
          "border border-[var(--color-border-subtle)]",
          "transition-all duration-[var(--transition-base)]",
          "hover:border-[var(--color-border)] hover:text-[var(--color-text-secondary)]",
          "text-[var(--text-sm)]"
        )}
        aria-label="Search recipes"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search recipes…</span>
        <kbd
          className={cn(
            "hidden sm:inline-flex items-center gap-0.5 rounded px-1.5 py-0.5",
            "bg-[var(--color-bg)] text-[var(--color-text-faint)]",
            "border border-[var(--color-border-subtle)]",
            "text-[11px] font-mono leading-none"
          )}
        >
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-start justify-center pt-[12vh] sm:pt-[16vh]"
      style={{ zIndex: "var(--z-modal)" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Dialog */}
      <div
        className={cn(
          "relative w-[calc(100%-2rem)] max-w-[560px]",
          "bg-[var(--color-surface)] rounded-2xl",
          "shadow-[var(--shadow-xl)] border border-[var(--color-border-subtle)]",
          "overflow-hidden",
          "animate-in fade-in slide-in-from-top-4 duration-200"
        )}
        role="dialog"
        aria-label="Search recipes"
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border-subtle)]">
          <Search className="size-5 text-[var(--color-text-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={onKeyDownInput}
            placeholder="Search recipes, ingredients, categories…"
            className={cn(
              "flex-1 bg-transparent text-[var(--color-text)]",
              "placeholder:text-[var(--color-text-faint)]",
              "outline-none text-base"
            )}
            aria-label="Search"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => handleInputChange("")}
              className="p-1 rounded-md hover:bg-[var(--color-surface-raised)] text-[var(--color-text-muted)]"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[360px] overflow-y-auto overscroll-contain">
          {loading && query.length >= 2 && (
            <div className="px-4 py-8 text-center text-[var(--color-text-muted)] text-sm">
              <div className="inline-block size-5 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin" />
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-[var(--color-text-muted)] text-sm">
                No recipes found for &ldquo;{query}&rdquo;
              </p>
            </div>
          )}

          {results.map((result, i) => (
            <button
              key={result.id}
              onClick={() => navigate(result.slug)}
              onMouseEnter={() => setActiveIndex(i)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left",
                "transition-colors duration-100",
                i === activeIndex
                  ? "bg-[var(--color-accent-light)]"
                  : "hover:bg-[var(--color-surface-raised)]"
              )}
              aria-selected={i === activeIndex}
              role="option"
            >
              {/* Thumbnail */}
              {result.heroImage ? (
                <img
                  src={result.heroImage}
                  alt=""
                  className="size-12 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="size-12 rounded-lg bg-[var(--color-surface-raised)] shrink-0 flex items-center justify-center">
                  <Search className="size-4 text-[var(--color-text-faint)]" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--color-text)] truncate text-sm">
                  {result.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {result.categoryName && (
                    <span className="text-xs text-[var(--color-accent)] font-medium">
                      {result.categoryName}
                    </span>
                  )}
                  {(result.prepTime || result.cookTime) && (
                    <span className="flex items-center gap-1 text-xs text-[var(--color-text-faint)]">
                      <Clock className="size-3" />
                      {(result.prepTime ?? 0) + (result.cookTime ?? 0)} min
                    </span>
                  )}
                </div>
              </div>

              {i === activeIndex && (
                <ArrowRight className="size-4 text-[var(--color-accent)] shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]">
          <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-faint)] font-mono">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border-subtle)]">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border-subtle)]">↵</kbd>
              open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border-subtle)]">esc</kbd>
              close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
