import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { PRIVACY_SECTION } from "../constants/content";
import { MetricPill } from "./metric-pill";

export function LandingPrivacy() {
  return (
    <section id="privacy" className="mx-auto w-full max-w-6xl scroll-mt-8 px-4 py-16">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal className="relative flex min-h-80 items-center justify-center rounded-3xl bg-linear-160 from-panel-sand-from to-panel-sand-to p-6">
          <div aria-hidden className="contents">
            <RevealGroup as="ul" className="w-full max-w-xs space-y-3" stagger={0.12}>
              {PRIVACY_SECTION.rows.map((row) => (
                <RevealItem
                  as="li"
                  key={row.label}
                  className="flex items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3 text-xs shadow-sm"
                >
                  <span className="font-medium">{row.label}</span>
                  <MetricPill tone={row.tone}>{row.value}</MetricPill>
                </RevealItem>
              ))}
            </RevealGroup>
            <span className="absolute -bottom-4 left-6 flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-medium shadow-md">
              <span className="grid size-5 place-items-center rounded-full bg-brand-yellow">✓</span>
              {PRIVACY_SECTION.badge}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="max-w-md text-balance text-3xl font-bold leading-tight tracking-tight md:text-[2.75rem]">
            {PRIVACY_SECTION.title}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">{PRIVACY_SECTION.text}</p>
          <RevealGroup as="ul" className="mt-6 space-y-3" stagger={0.08}>
            {PRIVACY_SECTION.points.map((point) => (
              <RevealItem as="li" key={point} className="flex items-center gap-3 text-sm">
                <span aria-hidden className="grid size-4 shrink-0 place-items-center rounded-full bg-brand-orange text-tone-foreground">
                  <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 6.2 2 2L9 4" />
                  </svg>
                </span>
                {point}
              </RevealItem>
            ))}
          </RevealGroup>
        </Reveal>
      </div>
    </section>
  );
}
