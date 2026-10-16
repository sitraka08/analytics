import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { SHOWCASE_SECTION } from "../constants/content";
import { MetricPill } from "./metric-pill";

type ShowcaseId = (typeof SHOWCASE_SECTION.cards)[number]["id"];

function SourcesVisual() {
  return (
    <ul className="w-full space-y-2">
      {SHOWCASE_SECTION.sources.map((source) => (
        <li key={source.label} className="flex items-center justify-between rounded-xl bg-surface px-3 py-2 text-xs shadow-sm">
          <span>{source.label}</span>
          <span className="flex gap-1">
            {source.values.map((value) => (
              <MetricPill key={value} tone={source.tone}>
                {value}
              </MetricPill>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ScriptVisual() {
  return (
    <pre className="w-full overflow-hidden rounded-xl bg-foreground p-4 text-[0.7rem] leading-relaxed text-background shadow-lg">
      <code>
        <span className="text-brand-violet">{"<script"}</span>
        {"\n  defer\n  src=\".../script.js\"\n  data-site=\"votre-cle\"\n"}
        <span className="text-brand-violet">{"></script>"}</span>
      </code>
    </pre>
  );
}

function AddSiteVisual() {
  return (
    <div className="grid w-full place-items-center gap-2 rounded-xl border-2 border-dashed border-brand-blue/60 bg-surface/90 py-8 text-xs font-medium shadow-sm">
      <span className="grid size-8 place-items-center rounded-full bg-brand-blue text-lg leading-none text-white">+</span>
      {SHOWCASE_SECTION.addSite}
    </div>
  );
}

const VISUALS: Record<ShowcaseId, () => React.ReactElement> = {
  sources: SourcesVisual,
  script: ScriptVisual,
  "add-site": AddSiteVisual,
};

const VISUAL_BACKGROUNDS: Record<ShowcaseId, string> = {
  sources: "bg-linear-160 from-panel-sage-from to-panel-sage-to",
  script: "bg-linear-160 from-panel-sand-from to-panel-sand-to",
  "add-site": "bg-linear-160 from-panel-sky-from to-panel-sky-to",
};

export function LandingShowcase() {
  return (
    <section id="install" className="mx-auto w-full max-w-6xl scroll-mt-8 px-4 py-16 md:py-24">
      <Reveal className="text-center">
        <h2 className="mx-auto max-w-xl text-balance text-3xl font-bold leading-tight tracking-tight md:text-[2.75rem]">
          {SHOWCASE_SECTION.title}
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{SHOWCASE_SECTION.text}</p>
      </Reveal>

      <RevealGroup as="ul" className="mt-12 grid gap-8 md:grid-cols-3 md:gap-5" stagger={0.12}>
        {SHOWCASE_SECTION.cards.map((card) => {
          const Visual = VISUALS[card.id];
          return (
            <RevealItem as="li" key={card.id}>
              <div
                aria-hidden
                className={`flex h-72 items-end rounded-3xl p-4 transition-transform duration-300 ease-out hover:-translate-y-1.5 motion-reduce:transform-none ${VISUAL_BACKGROUNDS[card.id]}`}
              >
                <Visual />
              </div>
              <h3 className="mt-5 font-bold">{card.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{card.text}</p>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
