import { X } from "lucide-react";
import type { Filters } from "../schemas/filters";
import { FILTER_KEYS } from "../schemas/filters";
import type { Period } from "../schemas/period";
import { DashboardLink } from "./dashboard-link";
import { formatFilterValue } from "../utils/filter-label";

const FILTER_LABELS = {
  page: "Page",
  referrer: "Source",
  country: "Pays",
  city: "Ville",
  device: "Appareil",
} as const;

type ActiveFiltersProps = {
  basePath: string;
  period: Period;
  filters: Filters;
};

export function ActiveFilters({
  basePath,
  period,
  filters,
}: ActiveFiltersProps) {
  const active = FILTER_KEYS.filter((key) => filters[key]);
  if (active.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      aria-label="Filtres actifs"
      role="group"
    >
      {active.map((key) => (
        <DashboardLink
          key={key}
          basePath={basePath}
          period={period}
          filters={{ ...filters, [key]: undefined }}
          className="inline-flex h-9 max-w-full items-center gap-1.5 rounded-full bg-foreground pr-2.5 pl-3.5 text-sm text-background transition-opacity hover:opacity-85"
        >
          <span className="truncate">
            {FILTER_LABELS[key]} :{" "}
            <strong className="font-medium">
              {formatFilterValue(key, filters[key] as string)}
            </strong>
          </span>
          <X className="size-3.5 shrink-0" aria-hidden />
          <span className="sr-only">Retirer le filtre</span>
        </DashboardLink>
      ))}
      {active.length > 1 ? (
        <DashboardLink
          basePath={basePath}
          period={period}
          filters={{}}
          className="px-1 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Tout effacer
        </DashboardLink>
      ) : null}
    </div>
  );
}
