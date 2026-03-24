"use client";

import { useRecipe } from "./recipe-interactive-panel";
import { cn } from "@/lib/utils";
import type { UnitSystem } from "@/lib/types";

const OPTIONS: { value: UnitSystem; label: string }[] = [
  { value: "us", label: "US" },
  { value: "metric", label: "Metric" },
];

export function UnitToggle() {
  const { unitSystem, setUnitSystem } = useRecipe();

  return (
    <div
      className={cn(
        "inline-flex rounded-xl p-1 gap-0.5",
        "bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]"
      )}
      role="radiogroup"
      aria-label="Unit system"
    >
      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          role="radio"
          aria-checked={unitSystem === value}
          onClick={() => setUnitSystem(value)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-[var(--text-sm)] font-medium",
            "transition-all duration-[var(--transition-fast)]",
            "focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1",
            unitSystem === value
              ? "bg-[var(--color-surface)] text-[var(--color-accent)] shadow-[var(--shadow-sm)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
