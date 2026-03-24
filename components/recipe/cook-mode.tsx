"use client";

import { useState, useEffect, useRef } from "react";
import type { Step } from "@/lib/types";

export function CookMode({ steps, title }: { steps: Step[]; title: string }) {
  const [active, setActive] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!active) {
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

    function onVisibility() {
      if (document.visibilityState === "visible" && active) acquire();
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      wakeLockRef.current?.release();
    };
  }, [active]);

  return (
    <div>
      <label
        className="inline-flex items-center gap-[var(--space-sm)] cursor-pointer select-none"
      >
        <span
          className="text-[var(--text-sm)]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Cook mode
        </span>
        <button
          role="switch"
          aria-checked={active}
          onClick={() => setActive(!active)}
          className="relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200"
          style={{
            backgroundColor: active ? "var(--color-accent)" : "var(--color-border)",
          }}
        >
          <span
            className="pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-200"
            style={{
              transform: active ? "translate(17px, 1px)" : "translate(2px, 1px)",
            }}
          />
        </button>
      </label>
      <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-faint)" }}>
        Keeps screen on
      </p>
    </div>
  );
}
