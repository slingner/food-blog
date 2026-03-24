"use client";

import { useState, useTransition } from "react";
import { Star, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitReview } from "@/lib/actions/review-actions";
import { formatDate } from "@/lib/utils";
import type { Review, ReviewStats } from "@/lib/types";

function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md";
}) {
  const [hover, setHover] = useState(0);
  const px = size === "sm" ? "size-4" : "size-5";

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={cn(
            "transition-colors duration-100",
            readonly ? "cursor-default" : "cursor-pointer"
          )}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              px,
              (hover || value) >= star
                ? "fill-amber-400 text-amber-400"
                : "text-[var(--color-border)] fill-transparent"
            )}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="py-4 border-b border-[var(--color-border-subtle)] last:border-0">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          {/* Avatar initial */}
          <div
            className={cn(
              "size-8 rounded-full flex items-center justify-center shrink-0",
              "bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)]",
              "text-xs font-semibold uppercase"
            )}
          >
            {review.name.charAt(0)}
          </div>
          <div>
            <span className="text-[var(--text-sm)] font-medium text-[var(--color-text)]">
              {review.name}
            </span>
            <span className="text-[var(--text-xs)] text-[var(--color-text-faint)] ml-2">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>
        <StarRating value={review.rating} readonly size="sm" />
      </div>
      {review.comment && (
        <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] leading-relaxed pl-10">
          {review.comment}
        </p>
      )}
    </div>
  );
}

export function RecipeReviews({
  recipeId,
  reviews,
  stats,
}: {
  recipeId: number;
  reviews: Review[];
  stats: ReviewStats;
}) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setMessage({ type: "error", text: "Please select a rating" });
      return;
    }

    startTransition(async () => {
      const result = await submitReview({
        recipeId,
        name,
        email,
        rating,
        comment: comment || null,
      });
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: result.message ?? "Review submitted!" });
        setShowForm(false);
        setRating(0);
        setName("");
        setEmail("");
        setComment("");
      }
    });
  }

  return (
    <section className="space-y-6">
      {/* Stats header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text)]">Reviews</h3>
          {stats.totalReviews > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={Math.round(stats.averageRating)} readonly size="sm" />
              <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)] font-medium tabular-nums">
                {stats.averageRating.toFixed(1)}
              </span>
              <span className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
                ({stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""})
              </span>
            </div>
          )}
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className={cn(
              "text-[var(--text-sm)] font-medium px-4 py-2 rounded-xl",
              "border border-[var(--color-border)]",
              "text-[var(--color-text-secondary)]",
              "hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]",
              "transition-all duration-[var(--transition-base)]"
            )}
          >
            Write a review
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div
          className={cn(
            "px-4 py-3 rounded-xl text-[var(--text-sm)]",
            message.type === "success"
              ? "bg-emerald-50 text-[var(--color-success)] border border-emerald-200"
              : "bg-red-50 text-[var(--color-error)] border border-red-200"
          )}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className={cn(
            "space-y-4 p-5 rounded-2xl",
            "bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]"
          )}
        >
          <div>
            <label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2">
              Your rating
            </label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="review-name" className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-1.5">
                Name *
              </label>
              <input
                id="review-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-[var(--text-sm)]",
                  "bg-[var(--color-surface)] border border-[var(--color-border)]",
                  "text-[var(--color-text)] placeholder:text-[var(--color-text-faint)]",
                  "focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-light)]",
                  "outline-none transition-all duration-[var(--transition-fast)]"
                )}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="review-email" className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-1.5">
                Email *
              </label>
              <input
                id="review-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-[var(--text-sm)]",
                  "bg-[var(--color-surface)] border border-[var(--color-border)]",
                  "text-[var(--color-text)] placeholder:text-[var(--color-text-faint)]",
                  "focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-light)]",
                  "outline-none transition-all duration-[var(--transition-fast)]"
                )}
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="review-comment" className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-1.5">
              Comment <span className="text-[var(--color-text-faint)]">(optional)</span>
            </label>
            <textarea
              id="review-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={cn(
                "w-full px-3 py-2 rounded-xl text-[var(--text-sm)] resize-none",
                "bg-[var(--color-surface)] border border-[var(--color-border)]",
                "text-[var(--color-text)] placeholder:text-[var(--color-text-faint)]",
                "focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-light)]",
                "outline-none transition-all duration-[var(--transition-fast)]"
              )}
              placeholder="Share your experience making this recipe…"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl text-[var(--text-sm)] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[var(--text-sm)] font-medium",
                "bg-[var(--color-accent)] text-white",
                "hover:bg-[var(--color-accent-hover)]",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                "transition-all duration-[var(--transition-base)]"
              )}
            >
              <Send className="size-3.5" />
              {isPending ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        !showForm && (
          <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] py-4">
            No reviews yet. Be the first to share your experience!
          </p>
        )
      )}
    </section>
  );
}
