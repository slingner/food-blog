import {
  UtensilsCrossed,
  MessageSquare,
  Mail,
  FileCheck,
  Star,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

// ─── Stub data (replace with real queries when DB is wired) ───

const stats = {
  totalRecipes: 24,
  publishedRecipes: 18,
  pendingReviews: 7,
  subscribers: 142,
};

const recentReviews = [
  {
    id: 1,
    recipeTitle: "Classic Sourdough Bread",
    name: "Maria G.",
    rating: 5,
    comment: "Best sourdough recipe I've ever tried! The crust was perfectly crispy.",
    createdAt: new Date("2025-03-20"),
  },
  {
    id: 2,
    recipeTitle: "Thai Green Curry",
    name: "James K.",
    rating: 4,
    comment: "Great flavor, though I added extra chili for more heat.",
    createdAt: new Date("2025-03-19"),
  },
  {
    id: 3,
    recipeTitle: "Chocolate Lava Cake",
    name: "Sophie L.",
    rating: 5,
    comment: "Absolutely divine. The center was perfectly gooey.",
    createdAt: new Date("2025-03-18"),
  },
  {
    id: 4,
    recipeTitle: "Homemade Pasta",
    name: "Carlos R.",
    rating: 3,
    comment: "Good recipe but the dough was a bit dry for me. Maybe I need more practice.",
    createdAt: new Date("2025-03-17"),
  },
];

const statCards = [
  {
    label: "Total Recipes",
    value: stats.totalRecipes,
    icon: UtensilsCrossed,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    label: "Published",
    value: stats.publishedRecipes,
    icon: FileCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    label: "Pending Reviews",
    value: stats.pendingReviews,
    icon: MessageSquare,
    color: "text-[var(--admin-accent)]",
    bg: "bg-[var(--admin-accent)]/10",
  },
  {
    label: "Subscribers",
    value: stats.subscribers,
    icon: Mail,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "text-[var(--admin-border-subtle)]"
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--admin-text)] tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--admin-text-muted)] mt-1">
          Overview of your food blog
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[var(--admin-text-muted)] uppercase tracking-wider">
                {card.label}
              </span>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg ${card.bg}`}
              >
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--admin-text)] tabular-nums">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Reviews */}
      <div className="rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--admin-border)]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--admin-text-muted)]" />
            <h2 className="text-sm font-semibold text-[var(--admin-text)]">
              Recent Reviews
            </h2>
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[var(--admin-accent)]/15 text-[var(--admin-accent)] text-[11px] font-semibold">
              {stats.pendingReviews}
            </span>
          </div>
          <Link
            href="/admin/reviews"
            className="text-xs font-medium text-[var(--admin-accent)] hover:text-[var(--admin-accent-hover)] transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="divide-y divide-[var(--admin-border)]">
          {recentReviews.map((review) => (
            <div key={review.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-[var(--admin-text)]">
                      {review.name}
                    </span>
                    <span className="text-[var(--admin-text-muted)]">·</span>
                    <span className="text-xs text-[var(--admin-text-muted)]">
                      on{" "}
                      <span className="text-[var(--admin-text-secondary)]">
                        {review.recipeTitle}
                      </span>
                    </span>
                  </div>
                  <StarRating rating={review.rating} />
                  {review.comment && (
                    <p className="text-sm text-[var(--admin-text-secondary)] mt-2 line-clamp-2">
                      {review.comment}
                    </p>
                  )}
                </div>
                <span className="text-xs text-[var(--admin-text-muted)] whitespace-nowrap shrink-0">
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
