import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4 text-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-md mx-auto">
        {/* Illustrated plate with missing food */}
        <div
          className="mx-auto mb-8 flex items-center justify-center rounded-full"
          style={{
            width: "160px",
            height: "160px",
            backgroundColor: "var(--color-surface-raised)",
            border: "3px dashed var(--color-border)",
          }}
        >
          <span className="text-6xl" role="img" aria-label="empty plate">
            🍽️
          </span>
        </div>

        <h1
          className="text-3xl font-bold mb-3"
          style={{
            color: "var(--color-text)",
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          Recipe Not Found
        </h1>

        <p
          className="text-lg mb-8"
          style={{ color: "var(--color-text-muted)" }}
        >
          This dish seems to have wandered off the menu. Maybe it&apos;s still
          in the oven?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "white",
              borderRadius: "var(--radius-lg)",
            }}
          >
            Back to Kitchen
          </Link>
          <Link
            href="/recipes"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            Browse Recipes
          </Link>
        </div>
      </div>
    </div>
  );
}
