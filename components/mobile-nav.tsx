"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (label: string) => {
    setExpandedCategory((prev) => (prev === label ? null : label));
  };

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
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent side="left" className="flex w-[320px] flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-[var(--space-lg)] pt-[var(--space-lg)]">
          <SheetTitle>
            <Link href="/" className="font-display text-[var(--text-xl)] font-bold text-[var(--color-text)]">
              The Hungry Fork
            </Link>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation menu
          </SheetDescription>
        </SheetHeader>

        {/* Search */}
        <div className="px-[var(--space-lg)] pt-[var(--space-sm)]">
          <div className="relative">
            <Search className="absolute left-[var(--space-sm)] top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <Input
              type="search"
              placeholder="Search recipes..."
              className="h-10 pl-9 text-[var(--text-sm)]"
            />
          </div>
        </div>

        <Separator className="mx-[var(--space-lg)] mt-[var(--space-md)] w-auto" />

        {/* Navigation */}
        <nav
          className="flex-1 overflow-y-auto px-[var(--space-lg)] py-[var(--space-md)]"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-[var(--space-xs)]">
            {NAV_CATEGORIES.map((category) => (
              <li key={category.label}>
                {category.children.length > 0 ? (
                  <>
                    {/* Expandable category */}
                    <button
                      onClick={() => toggleCategory(category.label)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-[var(--radius-md)] px-[var(--space-sm)] py-[var(--space-sm)] text-left",
                        "text-[var(--text-base)] font-medium text-[var(--color-text)]",
                        "transition-colors hover:bg-[var(--color-surface-raised)]",
                        expandedCategory === category.label &&
                          "bg-[var(--color-accent-light)] text-[var(--color-accent)]"
                      )}
                      aria-expanded={expandedCategory === category.label}
                    >
                      {category.label}
                      <ChevronDown
                        className={cn(
                          "size-4 text-[var(--color-text-muted)] transition-transform duration-200",
                          expandedCategory === category.label && "rotate-180 text-[var(--color-accent)]"
                        )}
                      />
                    </button>

                    {/* Expanded children */}
                    <div
                      className={cn(
                        "grid transition-all duration-200",
                        expandedCategory === category.label
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <ul className="space-y-[var(--space-xs)] pb-[var(--space-sm)] pl-[var(--space-md)] pt-[var(--space-xs)]">
                          {/* View all link */}
                          <li>
                            <SheetClose
                              render={
                                <Link
                                  href={category.href}
                                  className={cn(
                                    "block rounded-[var(--radius-sm)] px-[var(--space-sm)] py-[var(--space-xs)]",
                                    "text-[var(--text-sm)] font-medium text-[var(--color-accent)]",
                                    "transition-colors hover:bg-[var(--color-accent-light)]"
                                  )}
                                />
                              }
                            >
                              View All {category.label}
                            </SheetClose>
                          </li>
                          {category.children.map((child) => (
                            <li key={child}>
                              <SheetClose
                                render={
                                  <Link
                                    href={`${category.href}/${slugify(child)}`}
                                    className={cn(
                                      "block rounded-[var(--radius-sm)] px-[var(--space-sm)] py-[var(--space-xs)]",
                                      "text-[var(--text-sm)] text-[var(--color-text-secondary)]",
                                      "transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]"
                                    )}
                                  />
                                }
                              >
                                {child}
                              </SheetClose>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Simple link (About) */
                  <SheetClose
                    render={
                      <Link
                        href={category.href}
                        className={cn(
                          "block rounded-[var(--radius-md)] px-[var(--space-sm)] py-[var(--space-sm)]",
                          "text-[var(--text-base)] font-medium text-[var(--color-text)]",
                          "transition-colors hover:bg-[var(--color-surface-raised)]"
                        )}
                      />
                    }
                  >
                    {category.label}
                  </SheetClose>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <Separator className="mx-[var(--space-lg)] w-auto" />

        {/* Subscribe CTA */}
        <div className="p-[var(--space-lg)]">
          <p className="mb-[var(--space-sm)] text-[var(--text-sm)] text-[var(--color-text-secondary)]">
            Get weekly recipes delivered to your inbox
          </p>
          <Button
            className="w-full rounded-[var(--radius-full)] bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
            size="lg"
            render={<Link href="/subscribe" />}
          >
            Subscribe to Newsletter
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
