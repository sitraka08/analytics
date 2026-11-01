"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { MAP_COUNTRIES, RANKING_LIMIT } from "../constants/ranking";
import { useRankingQuery, useSessionsQuery, useTimeseriesQuery } from "../hooks/use-analytics-queries";
import { useDashboardParams } from "../hooks/use-dashboard-params";
import type { Filters } from "../schemas/filters";
import type { RankingDimension } from "../types/analytics";
import { countryFlag } from "../utils/country-flag";
import { formatInteger } from "../utils/format";
import { formatFilterValue, parseDevice } from "../utils/filter-label";
import { getPeriodRange } from "../utils/period";
import { DashboardLink } from "./dashboard-link";
import { RankingList } from "./ranking-list";
import { RecentVisits } from "./recent-visits";
import { SectionError } from "./section-error";
import { SectionSkeleton } from "./section-skeleton";
import { VisitorsChart } from "./visitors-chart";
import type { Tone } from "@/lib/tones";

// The map ships the world geometry (~100 KB): load it on its own so the rest of the dashboard is not held back.
const WorldMap = dynamic(() => import("./world-map").then((module) => module.WorldMap), {
  loading: () => <SectionSkeleton className="h-52 rounded-2xl" />,
});

type SectionProps = { siteId: string };

export function VisitorsSection({ siteId }: SectionProps) {
  const { period, filters } = useDashboardParams();
  const query = useTimeseriesQuery(siteId, period, filters);

  if (!query.data) return query.isError ? <SectionError onRetry={() => query.refetch()} /> : <SectionSkeleton />;
  const { unit } = getPeriodRange(period);

  return (
    <section aria-busy={query.isPlaceholderData} className={cn("rounded-3xl bg-surface p-4 transition-opacity", query.isPlaceholderData && "opacity-60")}>
      <h2 className="text-base font-bold">Visiteurs par {unit === "hour" ? "heure" : "jour"}</h2>
      <div className="mt-3">
        <VisitorsChart points={query.data} unit={unit} />
      </div>
    </section>
  );
}

const RANKINGS: Record<RankingDimension, { title: string; emptyMessage: string; filterKey: keyof Filters; tone: Tone }> = {
  pages: { title: "Pages les plus vues", emptyMessage: "Aucune page vue sur cette période.", filterKey: "page", tone: "blue" },
  referrers: { title: "D'où viennent les visiteurs", emptyMessage: "Aucun site référent : les visites sont directes.", filterKey: "referrer", tone: "green" },
  countries: { title: "Pays", emptyMessage: "Pays inconnu pour le moment.", filterKey: "country", tone: "orange" },
  cities: { title: "Villes", emptyMessage: "Ville inconnue pour le moment.", filterKey: "city", tone: "green" },
  devices: { title: "Appareils", emptyMessage: "Aucun appareil détecté.", filterKey: "device", tone: "violet" },
};

const DEVICE_ICONS = { desktop: Monitor, mobile: Smartphone, tablet: Tablet } as const;

function leadingFor(dimension: RankingDimension, value: string) {
  if (dimension === "countries") return countryFlag(value);

  if (dimension === "devices") {
    const Icon = DEVICE_ICONS[parseDevice(value).type as keyof typeof DEVICE_ICONS];
    return Icon ? <Icon className="size-4" /> : null;
  }

  return null;
}

export function RankingSection({ siteId, basePath, dimension }: SectionProps & { basePath: string; dimension: RankingDimension }) {
  const { period, filters } = useDashboardParams();
  const query = useRankingQuery(siteId, dimension, period, filters, RANKING_LIMIT);
  const { title, emptyMessage, filterKey, tone } = RANKINGS[dimension];

  if (!query.data) return query.isError ? <SectionError className="h-56" onRetry={() => query.refetch()} /> : <SectionSkeleton className="h-56 rounded-3xl" />;

  const rows = query.data.map((item) => {
    const active = filters[filterKey] === item.label;

    return {
      label: formatFilterValue(filterKey, item.label),
      leading: leadingFor(dimension, item.label),
      visitors: item.visitors,
      filters: { ...filters, [filterKey]: active ? undefined : item.label },
      active,
    };
  });

  return (
    <div aria-busy={query.isPlaceholderData} className={cn("transition-opacity", query.isPlaceholderData && "opacity-60")}>
      <RankingList title={title} rows={rows} emptyMessage={emptyMessage} tone={tone} basePath={basePath} period={period} />
    </div>
  );
}

const TOP_COUNTRIES = 4;

export function WorldMapSection({ siteId, basePath }: SectionProps & { basePath: string }) {
  const { period, filters } = useDashboardParams();
  const query = useRankingQuery(siteId, "countries", period, filters, MAP_COUNTRIES);

  if (!query.data) return query.isError ? <SectionError className="h-80" onRetry={() => query.refetch()} /> : <SectionSkeleton className="h-80 rounded-3xl" />;

  const countries = query.data.map((item) => {
    const active = filters.country === item.label;
    return { code: item.label, visitors: item.visitors, filters: { ...filters, country: active ? undefined : item.label }, active };
  });

  return (
    <section
      aria-labelledby="world-map-title"
      aria-busy={query.isPlaceholderData}
      className={cn("rounded-3xl bg-surface p-4 transition-opacity", query.isPlaceholderData && "opacity-60")}
    >
      <h2 id="world-map-title" className="text-base font-bold">
        Visiteurs dans le monde
      </h2>
      {countries.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Pays inconnu pour le moment.</p>
      ) : (
        <>
          <div className="mt-2">
            <WorldMap countries={countries} basePath={basePath} period={period} />
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {countries.slice(0, TOP_COUNTRIES).map((country) => (
              <li key={country.code}>
                <DashboardLink
                  basePath={basePath}
                  period={period}
                  filters={country.filters}
                  aria-current={country.active ? "true" : undefined}
                  className={cn("underline-offset-4 hover:underline", country.active && "font-bold")}
                >
                  <span aria-hidden>{countryFlag(country.code)} </span>
                  {formatFilterValue("country", country.code)}{" "}
                  <span className="font-mono text-muted-foreground tabular-nums">{formatInteger(country.visitors)}</span>
                </DashboardLink>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export function RecentVisitsSection({ siteId }: SectionProps) {
  const { period, filters } = useDashboardParams();
  const query = useSessionsQuery(siteId, period, filters);

  if (!query.data) return query.isError ? <SectionError className="h-80" onRetry={() => query.refetch()} /> : <SectionSkeleton className="h-80 rounded-3xl" />;

  return (
    <div aria-busy={query.isPlaceholderData} className={cn("transition-opacity", query.isPlaceholderData && "opacity-60")}>
      <RecentVisits siteId={siteId} sessions={query.data.sessions.slice(0, 6)} />
    </div>
  );
}
