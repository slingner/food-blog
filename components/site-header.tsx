"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/mobile-nav";

const RECIPE_SUBCATEGORIES = [
  "Pasta & Noodles",
  "Soups & Stews",
  "Salads",
  "Meat & Poultry",
  "Seafood",
  "Vegetarian",
  "Baking & Desserts",
  "Breakfast & Brunch",
];

// Kept for other components that import NAV_CATEGORIES
export const NAV_CATEGORIES = [
  { label: "Recipes", href: "/recipes", children: RECIPE_SUBCATEGORIES },
  { label: "About", href: "/about", children: [] },
] as const;

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openRecipes = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setRecipesOpen(true);
  }, []);

  const closeRecipes = useCallback(() => {
    timeoutRef.current = setTimeout(() => setRecipesOpen(false), 180);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 w-full z-[var(--z-sticky)] transition-[box-shadow] duration-300",
        "supports-[backdrop-filter]:backdrop-blur-md",
        scrolled && "shadow-[var(--shadow-sm)]"
      )}
      style={{
        backgroundColor: scrolled
          ? "color-mix(in srgb, var(--color-bg) 92%, transparent)"
          : "var(--color-bg)",
      } as React.CSSProperties}
    >
      <div className="mx-auto flex max-w-[var(--container-xl)] items-center justify-between px-[var(--space-lg)] h-16">
        {/* Left: mobile nav */}
        <div className="lg:hidden">
          <MobileNav />
        </div>

        {/* Desktop left nav */}
        <nav
          className="hidden lg:flex items-center gap-[var(--space-2xl)]"
          role="navigation"
          aria-label="Main navigation"
        >
          <div
            className="relative"
            onMouseEnter={openRecipes}
            onMouseLeave={closeRecipes}
          >
            <Link
              href="/recipes"
              className={cn(
                "text-[var(--text-sm)] tracking-[0.04em] transition-colors",
                "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]",
                recipesOpen && "text-[var(--color-text)]"
              )}
            >
              Recipes
            </Link>

            {/* Dropdown */}
            <div
              className={cn(
                "absolute left-0 top-full pt-3 transition-all duration-200",
                recipesOpen
                  ? "pointer-events-auto opacity-100 translate-y-0"
                  : "pointer-events-none opacity-0 translate-y-1"
              )}
            >
              <div
                className="py-[var(--space-md)] px-[var(--space-sm)] min-w-[180px]"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-lg)",
                  border: "1px solid var(--color-border-subtle)",
                }}
              >
                {RECIPE_SUBCATEGORIES.map((name) => (
                  <Link
                    key={name}
                    href={`/categories/${slugify(name)}`}
                    className={cn(
                      "block px-[var(--space-md)] py-[var(--space-sm)]",
                      "text-[var(--text-sm)] text-[var(--color-text-secondary)]",
                      "transition-colors hover:text-[var(--color-accent)]",
                      "rounded-[var(--radius-sm)]"
                    )}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/about"
            className="text-[var(--text-sm)] tracking-[0.04em] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
          >
            About
          </Link>
        </nav>

        {/* Center: logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-display text-[var(--text-xl)] lg:text-[var(--text-2xl)] tracking-[var(--tracking-tight)]"
          style={{ color: "var(--color-text)" }}
        >
          The Hungry Milo
        </Link>

        {/* Right: search */}
        <Link
          href="/search"
          className="inline-flex items-center justify-center p-[var(--space-sm)] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
          aria-label="Search"
        >
          <Search className="size-[18px]" strokeWidth={1.5} />
        </Link>
      </div>
    </header>
  );
}
