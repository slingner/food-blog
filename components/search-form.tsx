"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchMockRecipes, heroPlaceholderColors } from "@/lib/mock-data";
import type { Recipe } from "@/lib/types";

interface SearchFormProps {
  defaultQuery?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchForm({
  defaultQuery,
  className,
  autoFocus = true,
}: SearchFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(defaultQuery ?? "");
  const [results, setResults] = useState<Recipe[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Autofocus on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Search as you type (debounced)
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      const matches = searchMockRecipes(query).slice(0, 5);
      setResults(matches);
      setShowDropdown(matches.length > 0);
      setSelectedIndex(-1);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        setShowDropdown(false);
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        setShowDropdown(false);
        router.push(`/recipes/${results[selectedIndex].slug}`);
      } else if (e.key === "Escape") {
        setShowDropdown(false);
      }
    },
    [showDropdown, results, selectedIndex, router]
  );

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <Search
          className="absolute left-4 top-1/2 size-[18px] -translate-y-1/2"
          style={{ color: "var(--color-text-faint)" }}
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search recipes..."
          autoComplete="off"
          className="w-full h-12 rounded-[var(--radius-xl)] pl-11 pr-4 text-[var(--text-base)] outline-none transition-shadow"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
            boxShadow: showDropdown ? "var(--shadow-md)" : "var(--shadow-sm)",
          }}
        />
      </form>

      {/* Autocomplete dropdown */}
      {showDropdown && (
        <div
          className="absolute left-0 right-0 top-full mt-[var(--space-xs)] overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            zIndex: "var(--z-dropdown)",
          }}
        >
          {results.map((recipe, i) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.slug}`}
              onClick={() => setShowDropdown(false)}
              className={cn(
                "flex items-center gap-[var(--space-md)] px-[var(--space-md)] py-[var(--space-sm)] transition-colors",
                i === selectedIndex
                  ? "bg-[var(--color-surface-raised)]"
                  : "hover:bg-[var(--color-surface-raised)]"
              )}
            >
              {/* Thumbnail */}
              <div
                className="size-10 shrink-0 overflow-hidden"
                style={{
                  borderRadius: "var(--radius-md)",
                  backgroundColor:
                    heroPlaceholderColors[recipe.id] ??
                    "var(--color-surface-raised)",
                }}
              >
                {recipe.heroImage && (
                  <Image
                    src={recipe.heroImage}
                    alt=""
                    width={40}
                    height={40}
                    className="size-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="text-[var(--text-sm)] font-medium truncate"
                  style={{ color: "var(--color-text)" }}
                >
                  {recipe.title}
                </p>
                {recipe.category && (
                  <p
                    className="text-[var(--text-xs)] truncate"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {recipe.category.name}
                  </p>
                )}
              </div>
            </Link>
          ))}

          {/* View all results link */}
          <div
            className="px-[var(--space-md)] py-[var(--space-sm)]"
            style={{ borderTop: "1px solid var(--color-border-subtle)" }}
          >
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => setShowDropdown(false)}
              className="text-[var(--text-sm)] transition-colors hover:text-[var(--color-accent)]"
              style={{ color: "var(--color-text-muted)" }}
            >
              View all results for &ldquo;{query}&rdquo;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
