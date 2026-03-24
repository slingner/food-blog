import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main
      className="mx-auto px-[var(--space-lg)] py-[var(--space-4xl)]"
      style={{ maxWidth: "var(--container-prose)" }}
    >
      <h1 className="font-display text-[var(--text-4xl)] tracking-[var(--tracking-tight)] leading-[var(--leading-tight)]">
        Privacy Policy
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
            What We Collect
          </h2>
          <p>
            We collect minimal information to provide you with the best experience. This includes your email address if you subscribe to our newsletter, and standard analytics data such as page views, browser type, and approximate location to understand how our recipes are being used.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[var(--text-xl)] mb-[var(--space-sm)]" style={{ color: "var(--color-text)" }}>
            How We Use Your Information
          </h2>
          <p>
            Your email is used solely to send you our newsletter. We never sell, rent, or share your personal information with third parties for marketing purposes. Analytics data helps us understand which recipes resonate and improve the site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[var(--text-xl)] mb-[var(--space-sm)]" style={{ color: "var(--color-text)" }}>
            Cookies
          </h2>
          <p>
            We use essential cookies to remember your preferences (such as unit system and bookmarked recipes). These are stored locally in your browser and are not sent to any server. We may use third-party analytics that set their own cookies — you can manage these in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[var(--text-xl)] mb-[var(--space-sm)]" style={{ color: "var(--color-text)" }}>
            Your Rights
          </h2>
          <p>
            You can unsubscribe from our newsletter at any time. You can request deletion of any personal data we hold by contacting us. We respect your privacy and will respond to all requests promptly.
          </p>
        </section>

        <section>
          <h2 className="font-display text-[var(--text-xl)] mb-[var(--space-sm)]" style={{ color: "var(--color-text)" }}>
            Contact
          </h2>
          <p>
            If you have any questions about this privacy policy, please reach out to us at hello@thehungrymilo.com.
          </p>
        </section>
      </div>
    </main>
  );
}
