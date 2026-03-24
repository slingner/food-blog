"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";

const NAV_CATEGORIES = [
  {
    label: "Recipes",
    href: "/recipes",
    children: [
      "Pasta & Noodles",
      "Soups & Stews",
      "Salads",
      "Meat & Poultry",
      "Seafood",
      "Vegetarian",
      "Baking & Desserts",
      "Breakfast & Brunch",
    ],
  },
  {
    label: "Techniques",
    href: "/techniques",
    children: ["Knife Skills", "Grilling", "Baking Basics", "Fermentation"],
  },
  {
    label: "Equipment",
    href: "/equipment",
    children: ["Cookware", "Knives", "Small Appliances"],
  },
  {
    label: "Ingredients",
    href: "/ingredients",
    children: ["Pantry Staples", "Seasonal Produce"],
  },
  {
    label: "Holidays",
    href: "/holidays",
    children: ["Thanksgiving", "Christmas", "Summer Cookout"],
  },
  {
    label: "About",
    href: "/about",
    children: [],
  },
] as const;

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export { NAV_CATEGORIES };

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = useCallback((label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 w-full transition-all duration-300",
        "bg-[var(--color-surface)]/95 supports-[backdrop-filter]:backdrop-blur-md",
        scrolled
          ? "shadow-[var(--shadow-md)] z-[var(--z-sticky)]"
          : "z-[var(--z-sticky)]"
      )}
      style={{ zIndex: "var(--z-sticky)" } as React.CSSProperties}
    >
      {/* Top bar */}
      <div className="mx-auto flex max-w-[var(--container-xl)] items-center justify-between px-[var(--space-lg)] py-[var(--space-sm)]">
        {/* Mobile hamburger + Logo */}
        <div className="flex items-center gap-[var(--space-sm)]">
          <div className="lg:hidden">
            <MobileNav />
          </div>
          <Link
            href="/"
            className="font-display text-[var(--text-2xl)] font-bold tracking-[var(--tracking-tight)] text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
          >
            The Hungry Fork
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-[var(--space-sm)]">
          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] p-[var(--space-sm)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]"
            aria-label="Search"
          >
            <Search className="size-5" />
          </Link>
          <Button
            className="hidden rounded-[var(--radius-full)] bg-[var(--color-accent)] px-[var(--space-lg)] text-white hover:bg-[var(--color-accent-hover)] sm:inline-flex"
            render={<Link href="/subscribe" />}
          >
            Subscribe
          </Button>
        </div>
      </div>

      {/* Desktop navigation bar */}
      <nav
        className="hidden border-t border-[var(--color-border-subtle)] lg:block"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex max-w-[var(--container-xl)] items-center justify-center gap-[var(--space-xs)] px-[var(--space-lg)]">
          {NAV_CATEGORIES.map((category) => (
            <div
              key={category.label}
              className="relative"
              onMouseEnter={() =>
                category.children.length > 0
                  ? handleMouseEnter(category.label)
                  : undefined
              }
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={category.href}
                className={cn(
                  "group inline-flex items-center gap-1 px-[var(--space-md)] py-[var(--space-sm)] text-[var(--text-sm)] font-medium tracking-[var(--tracking-wide)] uppercase transition-colors",
                  "text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]",
                  activeMenu === category.label && "text-[var(--color-accent)]"
                )}
              >
                {category.label}
                {category.children.length > 0 && (
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform duration-200",
                      activeMenu === category.label && "rotate-180"
                    )}
                  />
                )}
              </Link>

              {/* Mega menu dropdown */}
              {category.children.length > 0 && (
                <div
                  className={cn(
                    "absolute left-1/2 top-full -translate-x-1/2 pt-0",
                    "transition-all duration-200",
                    activeMenu === category.label
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-1 opacity-0"
                  )}
                >
                  <div
                    className={cn(
                      "min-w-[280px] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]",
                      "bg-[var(--color-surface)] p-[var(--space-lg)] shadow-[var(--shadow-lg)]"
                    )}
                  >
                    {/* Category heading inside dropdown */}
                    <div className="mb-[var(--space-sm)] border-b border-[var(--color-border-subtle)] pb-[var(--space-sm)]">
                      <Link
                        href={category.href}
                        className="font-display text-[var(--text-sm)] font-semibold tracking-[var(--tracking-wide)] uppercase text-[var(--color-accent)]"
                      >
                        All {category.label}
                      </Link>
                    </div>

                    {/* Subcategory links */}
                    <div
                      className={cn(
                        "grid gap-x-[var(--space-xl)] gap-y-[var(--space-xs)]",
                        category.children.length > 4
                          ? "grid-cols-2"
                          : "grid-cols-1"
                      )}
                    >
                      {category.children.map((child) => (
                        <Link
                          key={child}
                          href={`${category.href}/${slugify(child)}`}
                          className={cn(
                            "block rounded-[var(--radius-sm)] px-[var(--space-sm)] py-[var(--space-xs)] text-[var(--text-sm)]",
                            "text-[var(--color-text-secondary)] transition-all duration-150",
                            "hover:bg-[var(--color-accent-light)] hover:text-[var(--color-accent)]"
                          )}
                        >
                          {child}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
}
