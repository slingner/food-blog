"use client";

import { useState, useTransition, useRef } from "react";
import { ArrowRight, Check, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { subscribe } from "@/lib/actions/newsletter-actions";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    startTransition(async () => {
      const result = await subscribe(email);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: result.message ?? "Subscribed!" });
        setEmail("");
      }
    });
  }

  const isSuccess = message?.type === "success";

  return (
    <div
      className={cn(
        "rounded-2xl p-6 sm:p-8",
        "bg-[var(--color-surface)] border border-[var(--color-border-subtle)]",
        "shadow-[var(--shadow-sm)]"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-[var(--color-accent-light)]">
          <Mail className="size-4 text-[var(--color-accent)]" />
        </div>
        <h3 className="font-semibold text-[var(--color-text)]">
          Get recipes in your inbox
        </h3>
      </div>
      <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] mb-4">
        New recipes, seasonal guides &amp; cooking tips — no spam, unsubscribe anytime.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (message) setMessage(null);
            }}
            placeholder="your@email.com"
            disabled={isPending}
            className={cn(
              "w-full px-4 py-2.5 rounded-xl text-[var(--text-sm)]",
              "bg-[var(--color-surface-raised)] border border-[var(--color-border)]",
              "text-[var(--color-text)] placeholder:text-[var(--color-text-faint)]",
              "focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-light)]",
              "outline-none transition-all duration-[var(--transition-fast)]",
              "disabled:opacity-60"
            )}
            aria-label="Email address"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "shrink-0 flex items-center justify-center gap-1.5",
            "px-4 py-2.5 rounded-xl text-[var(--text-sm)] font-medium",
            "transition-all duration-[var(--transition-base)]",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            isSuccess
              ? "bg-[var(--color-success)] text-white"
              : "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
          )}
        >
          {isPending ? (
            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isSuccess ? (
            <Check className="size-4" />
          ) : (
            <>
              <span className="hidden sm:inline">Subscribe</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>

      {/* Message */}
      {message && (
        <p
          className={cn(
            "mt-3 text-[var(--text-xs)]",
            message.type === "success"
              ? "text-[var(--color-success)]"
              : "text-[var(--color-error)]"
          )}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
