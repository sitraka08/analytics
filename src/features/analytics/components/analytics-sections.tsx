import { Monitor, Smartphone, Tablet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tone } from "@/lib/tones";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import { getRanking } from "../services/ranking";
import { getTimeseries } from "../services/timeseries";
import type { RankingDimension } from "../types/analytics";
import { countryFlag } from "../utils/country-flag";
import { formatFilterValue, parseDevice } from "../utils/filter-label";
import { getPeriodRange } from "../utils/period";
import { buildDashboardHref } from "../utils/search-params";
import { RankingList } from "./ranking-list";
import { VisitorsChart } from "./visitors-chart";

type SectionProps = { userId: string; siteId: string; period: Period; filters: Filters };

export async function VisitorsSection({ userId, siteId, period, filters }: SectionProps) {
  const points = await getTimeseries(userId, siteId, period, filters);
  const { unit } = getPeriodRange(period);

  return (
    <section className="rounded-3xl bg-surface p-5">
      <h2 className="text-base font-bold">Visiteurs par {unit === "hour" ? "heure" : "jour"}</h2>
      <div className="mt-4">
        <VisitorsChart points={points} unit={unit} />
      </div>
    </section>
  );
}

const RANKINGS: Record<RankingDimension, { title: string; emptyMessage: string; filterKey: keyof Filters; tone: Tone }> = {
  pages: { title: "Pages les plus vues", emptyMessage: "Aucune page vue sur cette période.", filterKey: "page", tone: "blue" },
  referrers: { title: "D'où viennent les visiteurs", emptyMessage: "Aucun site référent : les visites sont directes.", filterKey: "referrer", tone: "green" },
  countries: { title: "Pays", emptyMessage: "Pays inconnu pour le moment.", filterKey: "country", tone: "orange" },
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

export function SectionSkeleton({ className }: { className?: string }) {
  return <Skeleton className={className ?? "h-64 rounded-3xl"} />;
}
