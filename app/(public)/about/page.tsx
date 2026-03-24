import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { NewsletterForm } from "@/components/newsletter-form";

export function generateMetadata(): Metadata {
  return {
    title: "About",
  };
}

const pillars = [
  {
    title: "Every Recipe Tested",
    description:
      "We make every recipe at least three times before it goes live. Different ovens, different brands of flour, different skill levels. If it can't survive real-world variation, it doesn't get published.",
  },
  {
    title: "Technique First",
    description:
      "Understanding why a method works matters more than following steps. When you know the science behind the sear, the emulsion, or the ferment, you stop needing recipes at all.",
  },
  {
    title: "No Shortcuts",
    description:
      "If a step matters, we include it. If it doesn't, we cut it. We'll never tell you to bloom spices if it won't make a difference — but we'll always tell you when it will.",
  },
];

const team = [
  {
    initials: "EC",
    name: "Elena Chen",
    role: "Editor-in-Chief",
    color: "var(--color-accent)",
    description:
      "Former restaurant cook turned obsessive recipe developer. Believes the best food writing treats readers like intelligent adults.",
  },
  {
    initials: "MR",
    name: "Marcus Rivera",
    role: "Senior Recipe Developer",
    color: "var(--color-success)",
    description:
      "Culinary school dropout who learned more from twenty years of home cooking than four semesters of classical technique.",
  },
  {
    initials: "JT",
    name: "Jade Thompson",
    role: "Test Kitchen Manager",
    color: "var(--color-warning)",
    description:
      "The person who actually makes every recipe three times. Keeps meticulous notes and has strong opinions about measuring cups.",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section
        className="mx-auto px-[var(--space-lg)] pb-[var(--space-3xl)] pt-[var(--space-4xl)]"
        style={{ maxWidth: "var(--container-xl)" }}
      >
        <h1
          className="font-display text-[var(--text-5xl)] font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] sm:text-[var(--text-6xl)]"
          style={{ color: "var(--color-text)" }}
        >
          About{" "}
          <span className="relative">
            The Hungry Fork
            <span
              className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
              aria-hidden="true"
            />
          </span>
        </h1>
      </section>

      {/* ── Story ── */}
      <section
        className="mx-auto px-[var(--space-lg)] pb-[var(--space-4xl)]"
        style={{ maxWidth: "var(--container-prose)" }}
      >
        <div className="space-y-[var(--space-lg)] text-[var(--text-lg)] leading-[var(--leading-relaxed)]" style={{ color: "var(--color-text-secondary)" }}>
          <p>
            The Hungry Fork started with a frustration most home cooks know
            well: you find a recipe online, follow it to the letter, and the
            result is&hellip; fine. Not bad. Not great. Just fine. Somewhere
            between the food stylist&apos;s photo and your dinner plate,
            something got lost.
          </p>
          <p>
            We believe that something is rigor. Most recipes are published after
            being made once, in a professional kitchen, by someone who already
            knows what they&apos;re doing. That&apos;s not a recipe — that&apos;s
            a memo.
          </p>
          <p>
            A real recipe accounts for the fact that your oven runs hot, your
            onions are a different size, and you&apos;re cooking while a toddler
            pulls at your leg. It anticipates failure points and steers you
            around them. It explains not just what to do, but why — so when
            something inevitably goes sideways, you can course-correct.
          </p>
          <p>
            Every recipe on this site has been tested a minimum of three times
            across different kitchens, with different equipment, by cooks of
            different skill levels. If a recipe can&apos;t survive that gauntlet,
            it doesn&apos;t get published. Period.
          </p>
        </div>
      </section>

      <Separator
        className="mx-auto"
        style={{ maxWidth: "var(--container-prose)" }}
      />

      {/* ── Philosophy ── */}
      <section
        className="mx-auto px-[var(--space-lg)] py-[var(--space-4xl)]"
        style={{ maxWidth: "var(--container-xl)" }}
      >
        <h2
          className="text-center font-display text-[var(--text-3xl)] font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] sm:text-[var(--text-4xl)]"
          style={{ color: "var(--color-text)" }}
        >
          Our Philosophy
        </h2>
        <p
          className="mx-auto mt-[var(--space-sm)] max-w-lg text-center text-[var(--text-base)] leading-[var(--leading-relaxed)]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Three principles guide everything we publish.
        </p>

        <div className="mx-auto mt-[var(--space-3xl)] grid max-w-4xl grid-cols-1 gap-[var(--space-xl)] md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className="rounded-[var(--radius-xl)] border p-[var(--space-xl)]"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <span
                className="inline-flex size-10 items-center justify-center rounded-full font-display text-[var(--text-lg)] font-bold text-white"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                {i + 1}
              </span>
              <h3
                className="mt-[var(--space-lg)] font-display text-[var(--text-xl)] font-semibold leading-[var(--leading-tight)]"
                style={{ color: "var(--color-text)" }}
              >
                {pillar.title}
              </h3>
              <p
                className="mt-[var(--space-sm)] text-[var(--text-sm)] leading-[var(--leading-relaxed)]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator
        className="mx-auto"
        style={{ maxWidth: "var(--container-prose)" }}
      />

      {/* ── Team ── */}
      <section
        className="mx-auto px-[var(--space-lg)] py-[var(--space-4xl)]"
        style={{ maxWidth: "var(--container-xl)" }}
      >
        <h2
          className="text-center font-display text-[var(--text-3xl)] font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] sm:text-[var(--text-4xl)]"
          style={{ color: "var(--color-text)" }}
        >
          The Team
        </h2>
        <p
          className="mx-auto mt-[var(--space-sm)] max-w-lg text-center text-[var(--text-base)] leading-[var(--leading-relaxed)]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          A small crew with strong opinions about salt.
        </p>

        <div className="mx-auto mt-[var(--space-3xl)] grid max-w-4xl grid-cols-1 gap-[var(--space-2xl)] md:grid-cols-3">
          {team.map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center">
              <div
                className="flex size-24 items-center justify-center rounded-full"
                style={{ backgroundColor: member.color }}
              >
                <span className="font-display text-[var(--text-2xl)] font-bold text-white select-none">
                  {member.initials}
                </span>
              </div>
              <h3
                className="mt-[var(--space-lg)] font-display text-[var(--text-xl)] font-semibold"
                style={{ color: "var(--color-text)" }}
              >
                {member.name}
              </h3>
              <span
                className="mt-[var(--space-xs)] text-[var(--text-sm)] font-medium uppercase tracking-[var(--tracking-wide)]"
                style={{ color: "var(--color-accent)" }}
              >
                {member.role}
              </span>
              <p
                className="mt-[var(--space-sm)] max-w-xs text-[var(--text-sm)] leading-[var(--leading-relaxed)]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator
        className="mx-auto"
        style={{ maxWidth: "var(--container-prose)" }}
      />

      {/* ── Newsletter CTA ── */}
      <section
        className="mx-auto px-[var(--space-lg)] py-[var(--space-4xl)]"
        style={{ maxWidth: "var(--container-prose)" }}
      >
        <div
          className="rounded-[var(--radius-xl)] px-[var(--space-2xl)] py-[var(--space-3xl)] text-center"
          style={{ backgroundColor: "var(--color-surface-raised)" }}
        >
          <h2
            className="font-display text-[var(--text-2xl)] font-bold leading-[var(--leading-tight)]"
            style={{ color: "var(--color-text)" }}
          >
            Cook with us
          </h2>
          <p
            className="mx-auto mt-[var(--space-sm)] max-w-md text-[var(--text-base)] leading-[var(--leading-relaxed)]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Weekly recipes, technique deep-dives, and the occasional rant about
            why you should own a kitchen scale. No spam, ever.
          </p>
          <div className="mx-auto mt-[var(--space-xl)] max-w-sm">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
