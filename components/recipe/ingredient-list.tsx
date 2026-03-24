"use client";

import { useState, useMemo } from "react";
import { useRecipe } from "./recipe-interactive-panel";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { Ingredient } from "@/lib/types";

function formatQuantity(qty: number): string {
  if (qty === 0) return "";
  // Common fractions
  const fractions: Record<string, string> = {
    "0.25": "¼",
    "0.33": "⅓",
    "0.5": "½",
    "0.67": "⅔",
    "0.75": "¾",
  };
  const whole = Math.floor(qty);
  const decimal = qty - whole;
  const decKey = decimal.toFixed(2);

  if (decimal === 0) return String(whole);
  const frac = fractions[decKey];
  if (frac) return whole > 0 ? `${whole} ${frac}` : frac;
  // Fall back to 1 decimal
  return qty % 1 === 0 ? String(qty) : qty.toFixed(1);
}

export function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
  const { multiplier, unitSystem } = useRecipe();
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(id: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Group ingredients by groupName
  const groups = useMemo(() => {
    const map = new Map<string | null, Ingredient[]>();
    for (const ing of ingredients) {
      const key = ing.groupName;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ing);
    }
    return Array.from(map.entries());
  }, [ingredients]);

  function renderIngredient(ing: Ingredient) {
    const isMetric = unitSystem === "metric";
    const qty = isMetric
      ? (ing.quantityMetric ?? ing.quantity)
      : ing.quantity;
    const unit = isMetric
      ? (ing.unitMetric ?? ing.unitUs)
      : ing.unitUs;
    const adjustedQty = qty ? qty * multiplier : null;
    const isChecked = checked.has(ing.id);

    return (
      <li key={ing.id} className="group">
        <button
          onClick={() => toggle(ing.id)}
          className={cn(
            "w-full flex items-start gap-3 py-2.5 px-1 rounded-lg text-left",
            "transition-colors duration-[var(--transition-fast)]",
            "hover:bg-[var(--color-surface-raised)]",
            "-mx-1"
          )}
          aria-pressed={isChecked}
        >
          {/* Checkbox */}
          <span
            className={cn(
              "mt-0.5 flex items-center justify-center size-5 rounded-md shrink-0",
              "border-2 transition-all duration-[var(--transition-fast)]",
              isChecked
                ? "bg-[var(--color-accent)] border-[var(--color-accent)]"
                : "border-[var(--color-border)] group-hover:border-[var(--color-text-faint)]"
            )}
          >
            {isChecked && <Check className="size-3 text-white" strokeWidth={3} />}
          </span>

          {/* Text */}
          <span
            className={cn(
              "flex-1 text-[var(--text-sm)] leading-relaxed transition-all duration-[var(--transition-fast)]",
              isChecked
                ? "line-through text-[var(--color-text-faint)]"
                : "text-[var(--color-text)]"
            )}
          >
            {adjustedQty != null && (
              <span className="font-semibold tabular-nums">
                {formatQuantity(adjustedQty)}
              </span>
            )}{" "}
            {unit && (
              <span className="text-[var(--color-text-secondary)]">{unit}</span>
            )}{" "}
            {ing.name}
            {ing.note && (
              <span className="text-[var(--color-text-muted)] italic">
                , {ing.note}
              </span>
            )}
          </span>
        </button>
      </li>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map(([groupName, items]) => (
        <div key={groupName ?? "__default"}>
          {groupName && (
            <h4 className="text-[var(--text-xs)] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2 px-1">
              {groupName}
            </h4>
          )}
          <ul className="space-y-0.5">
            {items.map(renderIngredient)}
          </ul>
        </div>
      ))}
    </div>
  );
}
