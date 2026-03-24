import type { Metadata } from "next";
import Link from "next/link";

export function generateMetadata(): Metadata {
  return { title: "About" };
}

export default function AboutPage() {
  return (
    <main
      className="mx-auto px-[var(--space-lg)] py-[var(--space-4xl)]"
      style={{ maxWidth: "var(--container-prose)" }}
    >
      <h1
        className="font-display text-[var(--text-4xl)] md:text-[var(--text-5xl)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-center"
        style={{ color: "var(--color-text)" }}
      >
        Hi, I&apos;m Tammy.
      </h1>

      <p
        className="mt-[var(--space-sm)] text-center text-[var(--text-base)]"
        style={{ color: "var(--color-text-muted)" }}
      >
        Home cook, recipe nerd, San Francisco
      </p>

      <div className="divider" />

      <div
        className="space-y-[var(--space-lg)] text-[var(--text-lg)] leading-[var(--leading-relaxed)]"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <p>
          The Hungry Milo is a cooking diary of sorts. It&apos;s where I keep the
          recipes I actually make on weeknights, the ones I bring to dinner parties,
          the Sunday projects that take over the whole kitchen. If I loved making it
          and want to make it again, it ends up here.
        </p>

        <p>
          It all started out of a small SF kitchen with questionable counter space
          and a gas stove that runs hot on one side. Nothing fancy, nothing
          professional. Just good food made with real enthusiasm and the
          occasional substitution because I forgot to buy cilantro.
        </p>

        <p>
          This site is really just a place to share what I love cooking. I hope
          you find something here that makes you excited to get in the kitchen.
        </p>
      </div>

      <div className="divider" />

      {/* Milo section */}
      <div className="text-center">
        <h2
          className="font-display text-[var(--text-3xl)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)]"
          style={{ color: "var(--color-text)" }}
        >
          And then there&apos;s Milo.
        </h2>

        <div
          className="mt-[var(--space-xl)] space-y-[var(--space-lg)] text-[var(--text-lg)] leading-[var(--leading-relaxed)] text-left"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <p>
            Milo is the real boss around here. He&apos;s a perpetually hungry dog who
            sits approximately two inches from the kitchen at all times, convinced
            that something is about to fall on the floor. He is usually right.
          </p>

          <p>
            He has strong opinions about cheese (for it), vegetables (against), and
            the sound of a cutting board being pulled out (extremely for). He taste-tests
            nothing because he&apos;s a dog and that would be a health code violation,
            but his enthusiasm is noted and appreciated.
          </p>

          <p>
            The blog is named after him because, honestly, his approach to food is
            the one we should all aspire to: wholehearted, joyful, and completely
            without pretension.
          </p>
        </div>
      </div>

      <div className="divider" />

      {/* What you'll find */}
      <div>
        <h2
          className="font-display text-[var(--text-2xl)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)]"
          style={{ color: "var(--color-text)" }}
        >
          What you&apos;ll find here
        </h2>

        <ul
          className="mt-[var(--space-lg)] space-y-[var(--space-md)] text-[var(--text-base)] leading-[var(--leading-relaxed)]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <li className="flex gap-[var(--space-sm)]">
            <span style={{ color: "var(--color-accent)" }}>&#10041;</span>
            <span>Recipes I actually make and love</span>
          </li>
          <li className="flex gap-[var(--space-sm)]">
            <span style={{ color: "var(--color-accent)" }}>&#10041;</span>
            <span>Honest notes about what worked and what didn&apos;t</span>
          </li>
          <li className="flex gap-[var(--space-sm)]">
            <span style={{ color: "var(--color-accent)" }}>&#10041;</span>
            <span>Weeknight dinners, weekend projects, and everything in between</span>
          </li>
        </ul>
      </div>

      <div className="divider" />

      <p
        className="text-center text-[var(--text-base)] italic leading-[var(--leading-relaxed)]"
        style={{ color: "var(--color-text-muted)" }}
      >
        Questions, recipe requests, or just want to say hi?
        <br />
        <a
          href="mailto:hello@thehungrymilo.com"
          className="transition-colors hover:text-[var(--color-accent)]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          hello@thehungrymilo.com
        </a>
      </p>
    </main>
  );
}
