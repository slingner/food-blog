import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  count?: number;
  className?: string;
}

export function StarRating({ rating, count, className }: StarRatingProps) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="inline-flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const starIndex = i + 1;
          const filled = rating >= starIndex;
          const halfFilled = !filled && rating >= starIndex - 0.5;

          return (
            <span key={i} className="relative inline-block size-3.5">
              {/* Empty star (background) */}
              <Star
                className="absolute inset-0 size-3.5"
                style={{ color: "var(--color-border)" }}
                strokeWidth={1.5}
              />
              {/* Filled or half-filled star */}
              {(filled || halfFilled) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: halfFilled ? "50%" : "100%" }}
                >
                  <Star
                    className="size-3.5 fill-current"
                    style={{ color: "var(--color-accent)" }}
                    strokeWidth={1.5}
                  />
                </span>
              )}
            </span>
          );
        })}
      </span>
      {count !== undefined && (
        <span
          className="text-xs leading-none"
          style={{ color: "var(--color-text-muted)" }}
        >
          ({count})
        </span>
      )}
    </span>
  );
}
