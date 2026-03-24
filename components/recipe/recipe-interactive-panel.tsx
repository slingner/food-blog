"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { UnitSystem, ServingMultiplier } from "@/lib/types";

type RecipeContext = {
  multiplier: ServingMultiplier;
  setMultiplier: (m: ServingMultiplier) => void;
  unitSystem: UnitSystem;
  setUnitSystem: (u: UnitSystem) => void;
  baseServings: number;
  adjustedServings: number;
};

const RecipeCtx = createContext<RecipeContext | null>(null);

export function useRecipe() {
  const ctx = useContext(RecipeCtx);
  if (!ctx) throw new Error("useRecipe must be used within RecipeInteractivePanel");
  return ctx;
}

export function RecipeInteractivePanel({
  baseServings,
  children,
}: {
  baseServings: number;
  children: ReactNode;
}) {
  const [multiplier, setMultiplier] = useState<ServingMultiplier>(1);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("us");

  // Hydrate unit preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("unit-system");
    if (saved === "us" || saved === "metric") {
      setUnitSystem(saved);
    }
  }, []);

  const handleSetUnit = useCallback((u: UnitSystem) => {
    setUnitSystem(u);
    localStorage.setItem("unit-system", u);
  }, []);

  return (
    <RecipeCtx.Provider
      value={{
        multiplier,
        setMultiplier,
        unitSystem,
        setUnitSystem: handleSetUnit,
        baseServings,
        adjustedServings: Math.round(baseServings * multiplier),
      }}
    >
      {children}
    </RecipeCtx.Provider>
  );
}
