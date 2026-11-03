"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { MAP_COUNTRIES, RANKING_LIMIT } from "../constants/ranking";
import { useRankingQuery, useSessionsQuery, useTimeseriesQuery } from "../hooks/use-analytics-queries";
import { useDashboardParams } from "../hooks/use-dashboard-params";
import type { Filters } from "../schemas/filters";
import type { ChartMetric, RankingDimension } from "../types/analytics";
import { countryFlag } from "../utils/country-flag";
import { formatInteger } from "../utils/format";
import { formatFilterValue, parseDevice } from "../utils/filter-label";
import { getPeriodRange } from "../utils/period";
import { DashboardLink } from "./dashboard-link";
import { Panel } from "./panel";
import { RankingList } from "./ranking-list";
import { RecentVisits } from "./recent-visits";
import { SectionError } from "./section-error";
import { SectionSkeleton } from "./section-skeleton";
import { HourFormatToggle, VisitorsChart } from "./visitors-chart";
import type { Tone } from "@/lib/tones";

// The map ships the world geometry (~100 KB): load it on its own so the rest of the dashboard is not held back.
const WorldMap = dynamic(() => import("./world-map").then((module) => module.WorldMap), {
  loading: () => <SectionSkeleton className="h-52 rounded-2xl" />,
});

type SectionProps = { siteId: string };

const METRIC_TITLES: Record<ChartMetric, string> = { visitors: "Visiteurs", pageviews: "Pages vues" };

export function VisitorsSection({ siteId, metric }: SectionProps & { metric: ChartMetric }) {
  const { period, filters } = useDashboardParams();
  const query = useTimeseriesQuery(siteId, period, filters);

  if (!query.data) return query.isError ? <SectionError className="h-80" onRetry={() => query.refetch()} /> : <SectionSkeleton className="h-80 rounded-3xl sm:h-96" />;
  const { unit } = getPeriodRange(period);

  return (
    <Panel
      busy={query.isPlaceholderData}
      title={`${METRIC_TITLES[metric]} par ${unit === "hour" ? "heure" : "jour"}`}
      description="Cliquez sur une carte ci-dessus pour changer de courbe."
      action={unit === "hour" ? <HourFormatToggle /> : null}
    >
      <VisitorsChart points={query.data} unit={unit} metric={metric} />
    </Panel>
  );
}

const RANKINGS: Record<RankingDimension, { title: string; columnLabel: string; emptyMessage: string; filterKey: keyof Filters; tone: Tone }> = {
  pages: { title: "Pages les plus vues", columnLabel: "Page", emptyMessage: "Aucune page vue sur cette période.", filterKey: "page", tone: "blue" },
  referrers: {
    title: "D'où viennent les visiteurs",
    columnLabel: "Source",
    emptyMessage: "Aucun site référent : les visites sont directes.",
    filterKey: "referrer",
    tone: "green",
  },
  countries: { title: "Pays", columnLabel: "Pays", emptyMessage: "Pays inconnu pour le moment.", filterKey: "country", tone: "orange" },
  cities: { title: "Villes", columnLabel: "Ville", emptyMessage: "Ville inconnue pour le moment.", filterKey: "city", tone: "orange" },
  devices: { title: "Appareils", columnLabel: "Appareil", emptyMessage: "Aucun appareil détecté.", filterKey: "device", tone: "violet" },
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

type RankingSectionProps = SectionProps & { basePath: string; dimension: RankingDimension; total: number };

export function RankingSection({ siteId, basePath, dimension, total }: RankingSectionProps) {
  const { period, filters } = useDashboardParams();
  const query = useRankingQuery(siteId, dimension, period, filters, RANKING_LIMIT);
  const { title, columnLabel, emptyMessage, filterKey, tone } = RANKINGS[dimension];

  if (!query.data) return query.isError ? <SectionError className="h-72" onRetry={() => query.refetch()} /> : <SectionSkeleton className="h-72 rounded-3xl" />;

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
    <RankingList
      title={title}
      columnLabel={columnLabel}
      rows={rows}
      emptyMessage={emptyMessage}
      tone={tone}
      basePath={basePath}
      period={period}
      total={total}
      busy={query.isPlaceholderData}
    />
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
    <Panel busy={query.isPlaceholderData} title="Visiteurs dans le monde" description="Cliquez sur un pays pour filtrer." className="h-full">
      {countries.length === 0 ? (
        <p className="rounded-2xl bg-cream-deep px-4 py-3 text-sm text-muted-foreground">Pays inconnu pour le moment.</p>
      ) : (
        <>
          <WorldMap countries={countries} basePath={basePath} period={period} />
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
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
    </Panel>
  );
}

export function RecentVisitsSection({ siteId }: SectionProps) {
  const { period, filters } = useDashboardParams();
  const query = useSessionsQuery(siteId, period, filters);

  if (!query.data) return query.isError ? <SectionError className="h-80" onRetry={() => query.refetch()} /> : <SectionSkeleton className="h-80 rounded-3xl" />;

  return <RecentVisits siteId={siteId} sessions={query.data.sessions.slice(0, 6)} busy={query.isPlaceholderData} />;
}
