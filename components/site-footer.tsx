import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { NewsletterForm } from "@/components/newsletter-form";

/*
 * Social media brand icons are not available in lucide-react,
 * so we use inline SVG components matching the lucide style.
 */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="10" r="8" />
      <line x1="12" y1="14" x2="12" y2="22" />
      <path d="M9 22h6" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
    </svg>
  );
}

const FOOTER_NAV = [
  {
    heading: "Recipes",
    links: [
      { label: "Pasta & Noodles", href: "/recipes/pasta-noodles" },
      { label: "Soups & Stews", href: "/recipes/soups-stews" },
      { label: "Salads", href: "/recipes/salads" },
      { label: "Meat & Poultry", href: "/recipes/meat-poultry" },
      { label: "Seafood", href: "/recipes/seafood" },
      { label: "Vegetarian", href: "/recipes/vegetarian" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Techniques", href: "/techniques" },
      { label: "Equipment", href: "/equipment" },
      { label: "Ingredients", href: "/ingredients" },
      { label: "Holidays", href: "/holidays" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "YouTube", href: "https://youtube.com", icon: YoutubeIcon },
  { label: "Pinterest", href: "https://pinterest.com", icon: PinterestIcon },
  { label: "Twitter", href: "https://twitter.com", icon: TwitterIcon },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-[var(--space-4xl)]"
      style={{ backgroundColor: "var(--color-surface-raised)" }}
    >
      <div className="mx-auto max-w-[var(--container-xl)] px-[var(--space-lg)] py-[var(--space-3xl)]">
        {/* Main footer grid */}
        <div className="grid gap-[var(--space-3xl)] md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.8fr]">
          {/* Newsletter column */}
          <div>
            <Link
              href="/"
              className="font-display text-[var(--text-2xl)] font-bold text-[var(--color-text)]"
            >
              The Hungry Fork
            </Link>
            <p className="mt-[var(--space-md)] max-w-sm text-[var(--text-sm)] leading-[var(--leading-relaxed)] text-[var(--color-text-secondary)]">
              Weekly recipes, cooking tips, and ingredient spotlights delivered
              straight to your inbox. Join thousands of home cooks who trust The
              Hungry Fork.
            </p>
            <h3 className="mt-[var(--space-xl)] text-[var(--text-sm)] font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--color-text)]">
              Subscribe to our newsletter
            </h3>
            <NewsletterForm className="mt-[var(--space-sm)]" />
          </div>

          {/* Navigation columns */}
          <div className="grid grid-cols-2 gap-[var(--space-xl)]">
            {FOOTER_NAV.map((section) => (
              <div key={section.heading}>
                <h3 className="text-[var(--text-sm)] font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--color-text)]">
                  {section.heading}
                </h3>
                <ul className="mt-[var(--space-md)] space-y-[var(--space-sm)]">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[var(--text-sm)] text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-accent)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* About & Social column */}
          <div>
            <h3 className="text-[var(--text-sm)] font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--color-text)]">
              About
            </h3>
            <p className="mt-[var(--space-md)] text-[var(--text-sm)] leading-[var(--leading-relaxed)] text-[var(--color-text-secondary)]">
              The Hungry Fork is a food blog dedicated to approachable,
              well-tested recipes for passionate home cooks.
            </p>
            <Link
              href="/about"
              className="mt-[var(--space-sm)] inline-block text-[var(--text-sm)] font-medium text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
            >
              Learn more about us
            </Link>

            {/* Social links */}
            <h3 className="mt-[var(--space-xl)] text-[var(--text-sm)] font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--color-text)]">
              Follow us
            </h3>
            <div className="mt-[var(--space-md)] flex gap-[var(--space-sm)]">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex size-10 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-all duration-150 hover:bg-[var(--color-accent)] hover:text-white"
                >
                  <social.icon className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-[var(--space-2xl)]" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-[var(--space-sm)] text-[var(--text-xs)] text-[var(--color-text-muted)] sm:flex-row">
          <p>&copy; {currentYear} The Hungry Fork. All rights reserved.</p>
          <div className="flex gap-[var(--space-lg)]">
            <Link
              href="/privacy"
              className="transition-colors hover:text-[var(--color-text-secondary)]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-[var(--color-text-secondary)]"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
