"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

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

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function MobileNav() {
  const [recipesExpanded, setRecipesExpanded] = useState(false);

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
          />
        }
      >
        <Menu className="size-5" strokeWidth={1.5} />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="flex w-[300px] flex-col p-0"
        style={{ backgroundColor: "var(--color-bg)" } as React.CSSProperties}
      >
        <SheetHeader className="px-[var(--space-xl)] pt-[var(--space-xl)]">
          <SheetTitle>
            <Link
              href="/"
              className="font-display text-[var(--text-xl)] tracking-[var(--tracking-tight)]"
              style={{ color: "var(--color-text)" }}
            >
              The Hungry Milo
            </Link>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation
          </SheetDescription>
        </SheetHeader>

        {/* Search */}
        <div className="px-[var(--space-xl)] pt-[var(--space-lg)]">
          <Link
            href="/search"
            className="flex items-center gap-[var(--space-sm)] text-[var(--text-sm)]"
            style={{ color: "var(--color-text-muted)" }}
          >
            <Search className="size-4" strokeWidth={1.5} />
            Search recipes...
          </Link>
        </div>

        <div className="divider" />

        {/* Navigation */}
        <nav className="flex-1 px-[var(--space-xl)]" aria-label="Mobile navigation">
          {/* Recipes with expandable subcategories */}
          <button
            onClick={() => setRecipesExpanded(!recipesExpanded)}
            className={cn(
              "flex w-full items-center justify-between py-[var(--space-md)]",
              "font-display text-[var(--text-lg)]",
              "transition-colors",
              recipesExpanded
                ? "text-[var(--color-accent)]"
                : "text-[var(--color-text)]"
            )}
            aria-expanded={recipesExpanded}
          >
            Recipes
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200",
                recipesExpanded && "rotate-180"
              )}
              style={{ color: "var(--color-text-faint)" }}
              strokeWidth={1.5}
            />
          </button>

          <div
            className={cn(
              "grid transition-all duration-200",
              recipesExpanded
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="pb-[var(--space-md)] pl-[var(--space-md)] space-y-[var(--space-xs)]">
                <SheetClose
                  render={
                    <Link
                      href="/recipes"
                      className="block py-[var(--space-xs)] text-[var(--text-sm)] font-medium"
                      style={{ color: "var(--color-accent)" }}
                    />
                  }
                >
                  View All
                </SheetClose>
                {RECIPE_SUBCATEGORIES.map((name) => (
                  <SheetClose
                    key={name}
                    render={
                      <Link
                        href={`/categories/${slugify(name)}`}
                        className="block py-[var(--space-xs)] text-[var(--text-sm)] transition-colors hover:text-[var(--color-accent)]"
                        style={{ color: "var(--color-text-secondary)" }}
                      />
                    }
                  >
                    {name}
                  </SheetClose>
                ))}
              </div>
            </div>
          </div>

          {/* About */}
          <SheetClose
            render={
              <Link
                href="/about"
                className="block py-[var(--space-md)] font-display text-[var(--text-lg)] transition-colors hover:text-[var(--color-accent)]"
                style={{ color: "var(--color-text)" }}
              />
            }
          >
            About
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
