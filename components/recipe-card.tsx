import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { cn, formatMinutes } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { heroPlaceholderColors } from "@/lib/mock-data";
import type { Recipe } from "@/lib/types";

const difficultyStyles: Record<string, string> = {
  easy: "bg-[#2d7a4f]/10 text-[#2d7a4f]",
  medium: "bg-[#c47a1a]/10 text-[#c47a1a]",
  hard: "bg-[#c43e3e]/10 text-[#c43e3e]",
};

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  const totalTime =
    (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden",
        "border bg-[var(--color-surface)]",
        "transition-shadow",
        className
      )}
      style={{
        borderColor: "var(--color-border)",
        borderRadius: "var(--radius-lg)",
        transitionDuration: "var(--transition-base)",
      }}
    >
      {/* Hero image area — 3:2 aspect ratio */}
      <div className="relative aspect-[3/2] overflow-hidden">
        {recipe.heroImage ? (
          <Image
            src={recipe.heroImage}
            alt={recipe.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center transition-transform duration-300 ease-out group-hover:scale-105"
            style={{
              backgroundColor:
                heroPlaceholderColors[recipe.id] ?? "#d4a853",
            }}
          >
            <span
              className="font-display text-5xl font-bold text-white/80 select-none"
              aria-hidden="true"
            >
              {recipe.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="flex flex-1 flex-col gap-[var(--space-sm)] p-[var(--space-lg)]"
      >
        {/* Category badge */}
        {recipe.category && (
          <div>
            <Badge
              variant="secondary"
              className="text-[10px] uppercase tracking-wide"
            >
              {recipe.category.name}
            </Badge>
          </div>
        )}

        {/* Title */}
        <h3
          className="font-display text-lg font-semibold leading-tight line-clamp-2"
          style={{ color: "var(--color-text)" }}
        >
          {recipe.title}
        </h3>

        {/* Description */}
        {recipe.description && (
          <p
            className="text-sm leading-relaxed line-clamp-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {recipe.description}
          </p>
        )}

        {/* Footer */}
        <div
          className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-[var(--space-sm)]"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          {/* Time */}
          {totalTime > 0 && (
            <span
              className="inline-flex items-center gap-1 text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              <Clock className="size-3.5" />
              {formatMinutes(totalTime)}
            </span>
          )}

          {/* Difficulty */}
          {recipe.difficulty && (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                difficultyStyles[recipe.difficulty]
              )}
            >
              {recipe.difficulty}
            </span>
          )}

          {/* Star rating */}
          {recipe.reviewStats && (
            <span className="ml-auto">
              <StarRating
                rating={recipe.reviewStats.averageRating}
                count={recipe.reviewStats.totalReviews}
              />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
