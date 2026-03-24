"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  defaultQuery?: string;
  className?: string;
}

export function SearchForm({ defaultQuery, className }: SearchFormProps) {
  return (
    <form
      action="/search"
      method="GET"
      className={cn("relative", className)}
    >
      <Search
        className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--color-text-muted)]"
        aria-hidden="true"
      />
      <Input
        type="search"
        name="q"
        defaultValue={defaultQuery ?? ""}
        placeholder="Search recipes, ingredients, techniques..."
        className="h-14 rounded-[var(--radius-xl)] border-[var(--color-border)] bg-[var(--color-surface)] pl-12 pr-4 text-lg shadow-[var(--shadow-sm)] placeholder:text-[var(--color-text-faint)] focus-visible:ring-[var(--color-accent)]"
      />
    </form>
  );
}
