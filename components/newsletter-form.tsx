"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check } from "lucide-react";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className={cn(
          "flex items-center gap-[var(--space-sm)] rounded-[var(--radius-md)] bg-[var(--color-accent-light)] px-[var(--space-md)] py-[var(--space-sm)]",
          className
        )}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
          <Check className="size-4" />
        </div>
        <div>
          <p className="text-[var(--text-sm)] font-medium text-[var(--color-text)]">
            You&apos;re on the list!
          </p>
          <p className="text-[var(--text-xs)] text-[var(--color-text-secondary)]">
            Check your inbox to confirm your subscription.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex gap-[var(--space-sm)]", className)}
    >
      <div className="relative flex-1">
        <Mail className="absolute left-[var(--space-sm)] top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-10 pl-9 text-[var(--text-sm)]"
          aria-label="Email address"
        />
      </div>
      <Button
        type="submit"
        className="h-10 shrink-0 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-[var(--space-lg)] text-[var(--text-sm)] font-medium text-white hover:bg-[var(--color-accent-hover)]"
      >
        Subscribe
      </Button>
    </form>
  );
}
