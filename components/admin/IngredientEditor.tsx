"use client";

import { useState, useCallback } from "react";
import { Plus, GripVertical, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import type { IngredientFormData } from "@/lib/types";

type Props = {
  ingredients: IngredientFormData[];
  onChange: (ingredients: IngredientFormData[]) => void;
};

const UNITS_US = ["", "tsp", "tbsp", "cup", "fl oz", "oz", "lb", "piece", "clove", "slice", "pinch", "dash"];
const UNITS_METRIC = ["", "ml", "l", "g", "kg", "piece", "clove", "slice", "pinch", "dash"];

function blankIngredient(sortOrder: number, groupName: string | null = null): IngredientFormData {
  return {
    groupName,
    name: "",
    quantity: null,
    unitUs: null,
    unitMetric: null,
    quantityMetric: null,
    note: null,
    sortOrder,
  };
}

export function IngredientEditor({ ingredients, onChange }: Props) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  // Get unique group names preserving order
  const groups: (string | null)[] = [];
  for (const ing of ingredients) {
    if (!groups.includes(ing.groupName)) {
      groups.push(ing.groupName);
    }
  }

  const updateIngredient = useCallback(
    (index: number, field: keyof IngredientFormData, value: unknown) => {
      const updated = [...ingredients];
      updated[index] = { ...updated[index], [field]: value };
      onChange(updated);
    },
    [ingredients, onChange]
  );

  const addIngredient = (groupName: string | null = null) => {
    const maxSort = ingredients.length > 0
      ? Math.max(...ingredients.map((i) => i.sortOrder))
      : -1;
    onChange([...ingredients, blankIngredient(maxSort + 1, groupName)]);
  };

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  const addGroup = () => {
    const name = window.prompt("Group name (e.g. 'For the sauce'):");
    if (name?.trim()) {
      addIngredient(name.trim());
    }
  };

  const toggleGroup = (group: string) => {
    const next = new Set(collapsedGroups);
    if (next.has(group)) next.delete(group);
    else next.add(group);
    setCollapsedGroups(next);
  };

  // Drag reorder
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const updated = [...ingredients];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(idx, 0, moved);
    // Recalculate sort orders
    updated.forEach((ing, i) => (ing.sortOrder = i));
    onChange(updated);
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const groupIngredients = ingredients
          .map((ing, idx) => ({ ...ing, _idx: idx }))
          .filter((ing) => ing.groupName === group);
        const isCollapsed = group ? collapsedGroups.has(group) : false;

        return (
          <div key={group ?? "__default"}>
            {/* Group header */}
            {group && (
              <button
                type="button"
                onClick={() => toggleGroup(group)}
                className="flex items-center gap-2 mb-2 text-sm font-medium text-[var(--admin-text)] hover:text-[var(--admin-accent)] transition-colors"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                {group}
                <span className="text-xs text-[var(--admin-text-muted)] font-normal">
                  ({groupIngredients.length})
                </span>
              </button>
            )}

            {!isCollapsed && (
              <div className="space-y-2">
                {groupIngredients.map(({ _idx, ...ing }) => (
                  <div
                    key={_idx}
                    draggable
                    onDragStart={() => handleDragStart(_idx)}
                    onDragOver={(e) => handleDragOver(e, _idx)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-start gap-2 p-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] transition-opacity ${
                      dragIdx === _idx ? "opacity-50" : ""
                    }`}
                  >
                    <div className="pt-2 cursor-grab text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)]">
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_80px_100px_80px_100px] gap-2">
                      {/* Name */}
                      <input
                        type="text"
                        value={ing.name}
                        onChange={(e) =>
                          updateIngredient(_idx, "name", e.target.value)
                        }
                        placeholder="Ingredient name"
                        className="h-8 px-2.5 rounded-md bg-[var(--admin-surface)] border border-[var(--admin-border-subtle)] text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)]/40"
                      />

                      {/* US Qty */}
                      <input
                        type="number"
                        step="any"
                        value={ing.quantity ?? ""}
                        onChange={(e) =>
                          updateIngredient(
                            _idx,
                            "quantity",
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                        placeholder="Qty"
                        className="h-8 px-2.5 rounded-md bg-[var(--admin-surface)] border border-[var(--admin-border-subtle)] text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)]/40"
                      />

                      {/* US Unit */}
                      <select
                        value={ing.unitUs ?? ""}
                        onChange={(e) =>
                          updateIngredient(
                            _idx,
                            "unitUs",
                            e.target.value || null
                          )
                        }
                        className="h-8 px-2 rounded-md bg-[var(--admin-surface)] border border-[var(--admin-border-subtle)] text-sm text-[var(--admin-text)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)]/40"
                      >
                        {UNITS_US.map((u) => (
                          <option key={u} value={u}>
                            {u || "US unit"}
                          </option>
                        ))}
                      </select>

                      {/* Metric Qty */}
                      <input
                        type="number"
                        step="any"
                        value={ing.quantityMetric ?? ""}
                        onChange={(e) =>
                          updateIngredient(
                            _idx,
                            "quantityMetric",
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                        placeholder="Metric"
                        className="h-8 px-2.5 rounded-md bg-[var(--admin-surface)] border border-[var(--admin-border-subtle)] text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)]/40"
                      />

                      {/* Metric Unit */}
                      <select
                        value={ing.unitMetric ?? ""}
                        onChange={(e) =>
                          updateIngredient(
                            _idx,
                            "unitMetric",
                            e.target.value || null
                          )
                        }
                        className="h-8 px-2 rounded-md bg-[var(--admin-surface)] border border-[var(--admin-border-subtle)] text-sm text-[var(--admin-text)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)]/40"
                      >
                        {UNITS_METRIC.map((u) => (
                          <option key={u} value={u}>
                            {u || "Metric"}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Note (full width row on mobile) */}
                    <input
                      type="text"
                      value={ing.note ?? ""}
                      onChange={(e) =>
                        updateIngredient(
                          _idx,
                          "note",
                          e.target.value || null
                        )
                      }
                      placeholder="Note (optional)"
                      className="hidden sm:block h-8 w-32 px-2.5 rounded-md bg-[var(--admin-surface)] border border-[var(--admin-border-subtle)] text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)]/40"
                    />

                    <button
                      type="button"
                      onClick={() => removeIngredient(_idx)}
                      className="pt-1.5 text-[var(--admin-text-muted)] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addIngredient(group)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)] hover:bg-[var(--admin-surface-raised)] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add ingredient{group ? ` to "${group}"` : ""}
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        {groups.length === 0 && (
          <button
            type="button"
            onClick={() => addIngredient(null)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-[var(--admin-accent)] hover:bg-[var(--admin-accent)]/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Ingredient
          </button>
        )}
        <button
          type="button"
          onClick={addGroup}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-raised)] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Group
        </button>
      </div>
    </div>
  );
}
