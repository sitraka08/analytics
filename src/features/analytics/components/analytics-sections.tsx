import { Monitor, Smartphone, Tablet } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import { getRanking } from "../services/ranking";
import { getSessions } from "../services/sessions";
import { getTimeseries } from "../services/timeseries";
import type { RankingDimension } from "../types/analytics";
import { countryFlag } from "../utils/country-flag";
import { formatInteger } from "../utils/format";
import { formatFilterValue, parseDevice } from "../utils/filter-label";
import { getPeriodRange } from "../utils/period";
import { buildDashboardHref } from "../utils/search-params";
import { RankingList } from "./ranking-list";
import { RecentVisits } from "./recent-visits";
import { VisitorsChart } from "./visitors-chart";
import { WorldMap } from "./world-map";

type SectionProps = { userId: string; siteId: string; period: Period; filters: Filters };

export async function VisitorsSection({ userId, siteId, period, filters }: SectionProps) {
  const points = await getTimeseries(userId, siteId, period, filters);
  const { unit } = getPeriodRange(period);

  return (
    <section className="rounded-3xl bg-surface p-4">
      <h2 className="text-base font-bold">Visiteurs par {unit === "hour" ? "heure" : "jour"}</h2>
      <div className="mt-3">
        <VisitorsChart points={points} unit={unit} />
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

export async function RankingSection({
  dimension,
  basePath,
  ...props
}: SectionProps & { dimension: RankingDimension; basePath: string }) {
  const { title, emptyMessage, filterKey, tone } = RANKINGS[dimension];
  const items = await getRanking(props.userId, props.siteId, props.period, props.filters, dimension);

  const rows = items.map((item) => {
    const active = props.filters[filterKey] === item.label;
    const nextFilters = { ...props.filters, [filterKey]: active ? undefined : item.label };

    return {
      label: formatFilterValue(filterKey, item.label),
      leading: leadingFor(dimension, item.label),
      visitors: item.visitors,
      href: buildDashboardHref(basePath, props.period, nextFilters),
      active,
    };
  });

  return <RankingList title={title} rows={rows} emptyMessage={emptyMessage} tone={tone} />;
}

const MAP_COUNTRIES = 100;
const TOP_COUNTRIES = 4;

export async function WorldMapSection({ basePath, ...props }: SectionProps & { basePath: string }) {
  const items = await getRanking(props.userId, props.siteId, props.period, props.filters, "countries", MAP_COUNTRIES);
  const countries = items.map((item) => {
    const active = props.filters.country === item.label;
    const href = buildDashboardHref(basePath, props.period, { ...props.filters, country: active ? undefined : item.label });

    return { code: item.label, visitors: item.visitors, href, active };
  });

  return (
    <section aria-labelledby="world-map-title" className="rounded-3xl bg-surface p-4">
      <h2 id="world-map-title" className="text-base font-bold">
        Visiteurs dans le monde
      </h2>
      {countries.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Pays inconnu pour le moment.</p>
      ) : (
        <>
          <div className="mt-2">
            <WorldMap countries={countries} />
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {countries.slice(0, TOP_COUNTRIES).map((country) => (
              <li key={country.code}>
                <Link
                  href={country.href}
                  scroll={false}
                  aria-current={country.active ? "true" : undefined}
                  className={cn("underline-offset-4 hover:underline", country.active && "font-bold")}
                >
                  <span aria-hidden>{countryFlag(country.code)} </span>
                  {formatFilterValue("country", country.code)}{" "}
                  <span className="font-mono text-muted-foreground tabular-nums">{formatInteger(country.visitors)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export async function RecentVisitsSection({ userId, siteId, period, filters }: SectionProps) {
  const { sessions } = await getSessions(userId, siteId, period, filters, 1);

  return <RecentVisits siteId={siteId} sessions={sessions.slice(0, 6)} />;
}

export function SectionSkeleton({ className }: { className?: string }) {
  return <Skeleton className={className ?? "h-64 rounded-3xl"} />;
}
