import Link from "next/link";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="10" r="8" />
      <line x1="12" y1="14" x2="12" y2="22" />
      <path d="M9 22h6" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "Pinterest", href: "https://pinterest.com", icon: PinterestIcon },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-[var(--space-4xl)]">
      {/* Decorative separator */}
      <div className="divider" />

      <div
        className="mx-auto px-[var(--space-lg)] pb-[var(--space-3xl)] pt-[var(--space-xl)] text-center"
        style={{ maxWidth: "var(--container-md)" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-[var(--text-xl)] tracking-[var(--tracking-tight)]"
          style={{ color: "var(--color-text)" }}
        >
          The Hungry Milo
        </Link>

        <p
          className="mx-auto mt-[var(--space-md)] max-w-sm text-[var(--text-sm)] leading-[var(--leading-relaxed)]"
          style={{ color: "var(--color-text-muted)" }}
        >
          A cooking diary of sorts.
        </p>

        {/* Social */}
        <div className="mt-[var(--space-lg)] flex justify-center gap-[var(--space-lg)]">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="transition-colors"
              style={{ color: "var(--color-text-faint)" }}
            >
              <social.icon className="size-[18px]" />
            </a>
          ))}
        </div>

        {/* Bottom */}
        <div
          className="mt-[var(--space-2xl)] flex flex-col items-center gap-[var(--space-sm)] sm:flex-row sm:justify-center sm:gap-[var(--space-lg)]"
        >
          <p
            className="text-[var(--text-xs)] italic"
            style={{ color: "var(--color-text-faint)" }}
          >
            &copy; {currentYear} The Hungry Milo
          </p>
          <div
            className="flex gap-[var(--space-md)] text-[var(--text-xs)]"
            style={{ color: "var(--color-text-faint)" }}
          >
            <Link href="/privacy" className="transition-colors hover:text-[var(--color-text-secondary)]">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[var(--color-text-secondary)]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
