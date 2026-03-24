"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Step } from "@/lib/types";

export function CookMode({ steps, title }: { steps: Step[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Wake Lock
  useEffect(() => {
    if (!open) {
      wakeLockRef.current?.release();
      wakeLockRef.current = null;
      return;
    }
    async function acquire() {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        }
      } catch {
        // Wake lock not supported or denied
      }
    }
    acquire();

    // Re-acquire on visibility change
    function onVisibility() {
      if (document.visibilityState === "visible" && open) acquire();
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      wakeLockRef.current?.release();
    };
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setCurrent((c) => Math.min(c + 1, steps.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setCurrent((c) => Math.max(c - 1, 0));
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, steps.length]);

  // Swipe to advance
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchRef.current.x;
      const dy = touch.clientY - touchRef.current.y;
      touchRef.current = null;

      // Only horizontal swipes (ignore vertical scroll)
      if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;

      if (dx < 0) {
        setCurrent((c) => Math.min(c + 1, steps.length - 1));
      } else {
        setCurrent((c) => Math.max(c - 1, 0));
      }
    },
    [steps.length]
  );

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setCurrent(0); }}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl",
          "bg-[var(--color-text)] text-[var(--color-bg)]",
          "font-medium text-[var(--text-sm)]",
          "transition-all duration-[var(--transition-base)]",
          "hover:opacity-90 active:scale-[0.98]"
        )}
      >
        <ChefHat className="size-4" />
        Cook Mode
      </button>
    );
  }

  const step = steps[current];
  const progress = ((current + 1) / steps.length) * 100;

  return (
    <div
      className="fixed inset-0 bg-[#0a0a0a] text-white flex flex-col"
      style={{ zIndex: "var(--z-modal)" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <ChefHat className="size-5 text-[var(--color-accent)] shrink-0" />
          <span className="text-sm text-white/60 truncate">{title}</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-2 -mr-2 rounded-xl hover:bg-white/10 transition-colors"
          aria-label="Exit cook mode"
        >
          <X className="size-5" />
        </button>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/10 mx-5">
        <div
          className="h-full bg-[var(--color-accent)] transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-8 overflow-y-auto">
        <span className="text-[var(--color-accent)] font-mono text-sm font-semibold mb-4">
          Step {current + 1} of {steps.length}
        </span>

        <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-center max-w-2xl font-light">
          {step.instruction}
        </p>

        {step.tip && (
          <div className="mt-8 px-4 py-3 rounded-xl bg-white/5 border border-white/10 max-w-lg">
            <p className="text-sm text-white/50">
              <span className="font-semibold text-[var(--color-accent)]">Tip: </span>
              {step.tip}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <footer className="flex items-center justify-between px-5 py-5 shrink-0">
        <button
          onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
          disabled={current === 0}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium",
            "transition-all duration-[var(--transition-fast)]",
            current === 0
              ? "text-white/20 cursor-not-allowed"
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
        >
          <ChevronLeft className="size-4" />
          Previous
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5 max-w-[40%] flex-wrap justify-center">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "size-2 rounded-full transition-all duration-200",
                i === current
                  ? "bg-[var(--color-accent)] scale-125"
                  : i < current
                    ? "bg-white/40"
                    : "bg-white/15"
              )}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            if (current === steps.length - 1) {
              setOpen(false);
            } else {
              setCurrent((c) => c + 1);
            }
          }}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium",
            "transition-all duration-[var(--transition-fast)]",
            current === steps.length - 1
              ? "bg-[var(--color-accent)] text-white"
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
        >
          {current === steps.length - 1 ? "Done" : "Next"}
          {current < steps.length - 1 && <ChevronRight className="size-4" />}
        </button>
      </footer>
    </div>
  );
}
