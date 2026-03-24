import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <main
      className="mx-auto px-[var(--space-lg)] py-[var(--space-4xl)]"
      style={{ maxWidth: "var(--container-prose)" }}
    >
      <h1 className="font-display text-[var(--text-4xl)] tracking-[var(--tracking-tight)] leading-[var(--leading-tight)]">
        Terms of Use
      </h1>
      <p
        className="mt-[var(--space-sm)] text-[var(--text-sm)]"
        style={{ color: "var(--color-text-muted)" }}
      >
        Last updated: March 2026
      </p>

      <div className="divider" style={{ marginLeft: 0 }} />

      <div
        className="space-y-[var(--space-xl)] text-[var(--text-base)] leading-[var(--leading-relaxed)]"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <section>
          <h2 className="font-display text-[var(--text-xl)] mb-[var(--space-sm)]" style={{ color: "var(--color-text)" }}>
            Using Our Recipes
          </h2>
          <p>
            All recipes, photographs, and written content on The Hungry Milo are original works and are protected by copyright. You are welcome to cook from our recipes and share them with friends and family. Please do not republish our recipes in full without written permission.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[var(--text-xl)] mb-[var(--space-sm)]" style={{ color: "var(--color-text)" }}>
            Sharing & Attribution
          </h2>
          <p>
            If you would like to share a recipe on your blog or social media, please link back to the original recipe page and credit The Hungry Milo. You may use a single photograph with proper attribution and a link to the source.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[var(--text-xl)] mb-[var(--space-sm)]" style={{ color: "var(--color-text)" }}>
            User Reviews
          </h2>
          <p>
            By submitting a review, you grant us the right to display it on the recipe page. Reviews must be honest, relevant to the recipe, and free from offensive content. We reserve the right to moderate or remove reviews that violate these guidelines.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[var(--text-xl)] mb-[var(--space-sm)]" style={{ color: "var(--color-text)" }}>
            Disclaimer
          </h2>
          <p>
            Recipes are provided for informational purposes. Nutritional information, when provided, is an estimate. We are not responsible for allergic reactions or other adverse effects from preparing our recipes. Always use your judgment with ingredients and cooking techniques.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[var(--text-xl)] mb-[var(--space-sm)]" style={{ color: "var(--color-text)" }}>
            Contact
          </h2>
          <p>
            Questions about these terms? Reach out at hello@thehungrymilo.com.
          </p>
        </section>
      </div>
    </main>
  );
}
