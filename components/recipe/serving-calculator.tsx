"use client";

import { useRecipe } from "./recipe-interactive-panel";
import { cn } from "@/lib/utils";
import type { ServingMultiplier } from "@/lib/types";

const MULTIPLIERS: { value: ServingMultiplier; label: string }[] = [
  { value: 0.25, label: "¼×" },
  { value: 0.5, label: "½×" },
  { value: 1, label: "1×" },
  { value: 2, label: "2×" },
  { value: 3, label: "3×" },
];

export function ServingCalculator() {
  const { multiplier, setMultiplier, adjustedServings } = useRecipe();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)]">
          Servings
        </span>
        <span
          className={cn(
            "text-[var(--text-sm)] font-semibold tabular-nums",
            "text-[var(--color-accent)]"
          )}
        >
          {adjustedServings}
        </span>
      </div>

      <div
        className={cn(
          "inline-flex rounded-xl p-1 gap-0.5",
          "bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]"
        )}
        role="radiogroup"
        aria-label="Serving multiplier"
      >
        {MULTIPLIERS.map(({ value, label }) => (
          <button
            key={value}
            role="radio"
            aria-checked={multiplier === value}
            onClick={() => setMultiplier(value)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[var(--text-sm)] font-medium",
              "transition-all duration-[var(--transition-fast)]",
              "focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1",
              multiplier === value
                ? "bg-[var(--color-surface)] text-[var(--color-accent)] shadow-[var(--shadow-sm)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
