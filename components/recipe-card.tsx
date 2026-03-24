import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { cn, formatMinutes } from "@/lib/utils";
import { heroPlaceholderColors } from "@/lib/mock-data";
import type { Recipe } from "@/lib/types";

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
        "group flex flex-col",
        className
      )}
    >
      {/* Image — subtle rounded corners, gentle hover brightness */}
      <div
        className="relative aspect-[3/2] overflow-hidden"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        {recipe.heroImage ? (
          <Image
            src={recipe.heroImage}
            alt={recipe.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-[filter] duration-300 ease-out group-hover:brightness-[1.05]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center transition-[filter] duration-300 ease-out group-hover:brightness-[1.05]"
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

      {/* Content — open, airy, no card background */}
      <div className="flex flex-1 flex-col pt-[var(--space-md)]">
        {/* Category — tiny delicate uppercase label */}
        {recipe.category && (
          <span
            className="text-[10px] font-medium uppercase tracking-[0.1em]"
            style={{ color: "var(--color-accent)" }}
          >
            {recipe.category.name}
          </span>
        )}

        {/* Title — Playfair Display, elegant */}
        <h3
          className="font-display text-[var(--text-lg)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] line-clamp-2 mt-[var(--space-xs)] transition-colors"
          style={{
            color: "var(--color-text)",
            transitionDuration: "var(--transition-base)",
          }}
        >
          <span className="group-hover:text-[var(--color-accent)]">
            {recipe.title}
          </span>
        </h3>

        {/* Cook time — whisper-light metadata */}
        {totalTime > 0 && (
          <span
            className="inline-flex items-center gap-1 text-[var(--text-xs)] mt-[var(--space-sm)]"
            style={{ color: "var(--color-text-muted)" }}
          >
            <Clock className="size-3" />
            {formatMinutes(totalTime)}
          </span>
        )}
      </div>
    </Link>
  );
}
