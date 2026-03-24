"use client";

import { useState } from "react";
import { Check, X, Star, MessageSquare, Filter } from "lucide-react";
import { formatDate } from "@/lib/utils";

type ReviewRow = {
  id: number;
  recipeId: number;
  recipeTitle: string;
  name: string;
  email: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  createdAt: Date;
};

const stubReviews: ReviewRow[] = [
  { id: 1, recipeId: 1, recipeTitle: "Classic Sourdough Bread", name: "Maria G.", email: "maria@email.com", rating: 5, comment: "Best sourdough recipe I've ever tried! The crust was perfectly crispy.", approved: false, createdAt: new Date("2025-03-20") },
  { id: 2, recipeId: 2, recipeTitle: "Thai Green Curry", name: "James K.", email: "james@email.com", rating: 4, comment: "Great flavor, though I added extra chili for more heat.", approved: false, createdAt: new Date("2025-03-19") },
  { id: 3, recipeId: 3, recipeTitle: "Chocolate Lava Cake", name: "Sophie L.", email: "sophie@email.com", rating: 5, comment: "Absolutely divine. The center was perfectly gooey.", approved: false, createdAt: new Date("2025-03-18") },
  { id: 4, recipeId: 4, recipeTitle: "Homemade Pasta", name: "Carlos R.", email: "carlos@email.com", rating: 3, comment: "Good recipe but the dough was a bit dry for me.", approved: false, createdAt: new Date("2025-03-17") },
  { id: 5, recipeId: 1, recipeTitle: "Classic Sourdough Bread", name: "Anna P.", email: "anna@email.com", rating: 5, comment: "My family loved this! Will definitely make it again.", approved: true, createdAt: new Date("2025-03-10") },
  { id: 6, recipeId: 5, recipeTitle: "Roasted Vegetable Salad", name: "Tom H.", email: "tom@email.com", rating: 4, comment: "Simple and delicious. The dressing is amazing.", approved: true, createdAt: new Date("2025-03-05") },
  { id: 7, recipeId: 2, recipeTitle: "Thai Green Curry", name: "Liz M.", email: "liz@email.com", rating: 2, comment: "Not spicy enough for my taste and the instructions were unclear.", approved: false, createdAt: new Date("2025-03-16") },
];

type ReviewFilter = "pending" | "approved" | "all";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "text-[var(--admin-border-subtle)]"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewModerationPage() {
  const [filter, setFilter] = useState<ReviewFilter>("pending");
  const [reviews, setReviews] = useState(stubReviews);

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.approved).length;
  const approvedCount = reviews.filter((r) => r.approved).length;

  const handleApprove = (id: number) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: true } : r))
    );
  };

  const handleDelete = (id: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const filters: { key: ReviewFilter; label: string; count: number }[] = [
    { key: "pending", label: "Pending", count: pendingCount },
    { key: "approved", label: "Approved", count: approvedCount },
    { key: "all", label: "All", count: reviews.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--admin-text)] tracking-tight">
          Reviews
        </h1>
        <p className="text-sm text-[var(--admin-text-muted)] mt-1">
          Moderate user reviews
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--admin-surface)] w-fit">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-[var(--admin-surface-raised)] text-[var(--admin-text)]"
                : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)]"
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-xs opacity-60">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {filtered.map((review) => (
          <div
            key={review.id}
            className="rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--admin-surface-raised)] text-sm font-semibold text-[var(--admin-text)]">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--admin-text)]">
                      {review.name}
                    </p>
                    <p className="text-xs text-[var(--admin-text-muted)]">
                      {review.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <StarRating rating={review.rating} />
                  <span className="text-[var(--admin-text-muted)]">·</span>
                  <span className="text-xs text-[var(--admin-text-muted)]">
                    on{" "}
                    <span className="text-[var(--admin-text-secondary)]">
                      {review.recipeTitle}
                    </span>
                  </span>
                </div>

                {review.comment && (
                  <p className="text-sm text-[var(--admin-text-secondary)] mt-2">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-xs text-[var(--admin-text-muted)]">
                  {formatDate(review.createdAt)}
                </span>

                {review.approved ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-400/10 text-emerald-400">
                    <Check className="w-3 h-3" />
                    Approved
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-emerald-400/10 text-emerald-400 text-xs font-medium hover:bg-emerald-400/20 transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="flex items-center gap-1.5 h-7 px-2.5 rounded-md text-red-400 text-xs font-medium hover:bg-red-400/10 transition-colors"
                    >
                      <X className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--admin-text-muted)]">
            <MessageSquare className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">
              {filter === "pending"
                ? "No pending reviews"
                : "No reviews found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
