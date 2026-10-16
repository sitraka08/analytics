import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { STATS_SECTION } from "../constants/content";
import { StatCard } from "./stat-card";

const [blueCard, greenCard, orangeCard, yellowCard] = STATS_SECTION.cards;

function LiveTrafficPanel() {
  const { live } = STATS_SECTION;

  return (
    <div
      aria-hidden
      className="relative flex h-full min-h-96 flex-col justify-between gap-6 overflow-hidden rounded-3xl bg-linear-160 from-panel-warm-from to-panel-warm-to p-4"
    >
      <div className="flex flex-col items-end gap-3">
        <span className="flex items-center gap-2 self-start rounded-full bg-brand-blue px-3 py-1 text-xs font-medium text-white shadow-sm">
          <svg viewBox="0 0 16 16" className="size-3" fill="currentColor">
            <path d="M2 1.5 14 6.5 8.6 8.3 6.6 14Z" />
          </svg>
          {live.page}
        </span>
        <ul className="w-44 space-y-2 rounded-2xl bg-surface/95 p-3 text-xs shadow-md">
          {live.countries.map((country) => (
            <li key={country.name}>
              <div className="flex justify-between">
                <span>{country.name}</span>
                <span className="text-muted-foreground">{country.share} %</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-cream-deep">
                <div className="h-1.5 rounded-full bg-brand-green" style={{ width: `${country.share}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-surface p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{live.label}</span>
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-green opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2.5 rounded-full bg-accent-green" />
          </span>
        </div>
        <p className="mt-1 font-heading text-3xl font-bold tracking-tight">{live.value}</p>
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="mt-3 h-16 w-full">
          <defs>
            <linearGradient id="live-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 48 C20 44 30 30 50 34 S80 20 100 26 S140 8 160 14 S190 6 200 4 V60 H0Z" fill="url(#live-area)" />
          <path
            d="M0 48 C20 44 30 30 50 34 S80 20 100 26 S140 8 160 14 S190 6 200 4"
            fill="none"
            stroke="var(--brand-blue)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}

export function LandingStats() {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl scroll-mt-8 px-4 pb-16 pt-28 md:pt-40">
      <Reveal className="grid gap-6 md:grid-cols-2 md:items-start">
        <h2 className="max-w-md text-balance text-3xl font-bold leading-tight tracking-tight md:text-[2.75rem]">
          {STATS_SECTION.title}
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:justify-self-end">{STATS_SECTION.text}</p>
      </Reveal>

      <RevealGroup className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:grid-rows-2" stagger={0.1}>
        <RevealItem lift className="md:col-start-1 md:row-start-1">
          <StatCard {...blueCard} className="h-full" />
        </RevealItem>
        <RevealItem className="order-last col-span-2 md:order-0 md:col-span-1 md:col-start-2 md:row-span-2 md:row-start-1">
          <LiveTrafficPanel />
        </RevealItem>
        <RevealItem lift className="md:col-start-3 md:row-start-1">
          <StatCard {...greenCard} className="h-full" />
        </RevealItem>
        <RevealItem lift className="md:col-start-1 md:row-start-2">
          <StatCard {...orangeCard} className="h-full" />
        </RevealItem>
        <RevealItem lift className="md:col-start-3 md:row-start-2">
          <StatCard {...yellowCard} className="h-full" />
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
