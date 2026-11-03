"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Search,
} from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { RANKING_LIMIT } from "../constants/ranking";
import { rankingQueryOptions } from "../hooks/use-analytics-queries";
import { useDashboardNavigate } from "../hooks/use-dashboard-params";
import { FILTER_KEYS, type Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import type { RankingDimension } from "../types/analytics";
import { countryFlag } from "../utils/country-flag";
import { formatFilterValue } from "../utils/filter-label";
import { ActiveFilters } from "./active-filters";

const FIELDS: {
  label: string;
  filterKey: keyof Filters;
  dimension: RankingDimension;
}[] = [
  { label: "Page", filterKey: "page", dimension: "pages" },
  { label: "Source", filterKey: "referrer", dimension: "referrers" },
  { label: "Pays", filterKey: "country", dimension: "countries" },
  { label: "Ville", filterKey: "city", dimension: "cities" },
  { label: "Appareil", filterKey: "device", dimension: "devices" },
];

const optionLabel = (filterKey: keyof Filters, value: string) =>
  [
    filterKey === "country" ? countryFlag(value) : null,
    formatFilterValue(filterKey, value),
  ]
    .filter(Boolean)
    .join(" ");

const item =
  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-cream-deep focus-visible:bg-cream-deep focus-visible:outline-none";

type FilterBarProps = {
  siteId: string;
  period: Period;
  filters: Filters;
  basePath: string;
};

/** One "Filtrer" menu (dimension, then value) and the active filters as removable chips beside it. */
export function FilterBar({
  siteId,
  period,
  filters,
  basePath,
}: FilterBarProps) {
  const { go } = useDashboardNavigate(basePath);
  const [open, setOpen] = useState(false);
  const [fieldKey, setFieldKey] = useState<keyof Filters | null>(null);
  const [search, setSearch] = useState("");
  const field =
    FIELDS.find((candidate) => candidate.filterKey === fieldKey) ?? null;
  const activeCount = FILTER_KEYS.filter((key) => filters[key]).length;

  // Options come from the period's own data, unfiltered, so a value can always be swapped for another.
  // Loaded only once a dimension is picked; the unfiltered ranking cards usually have them cached already.
  const options = useQuery({
    ...rankingQueryOptions(
      siteId,
      field?.dimension ?? "pages",
      period,
      {},
      RANKING_LIMIT,
    ),
    enabled: field !== null,
  });

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setFieldKey(null);
      setSearch("");
    }
  }

  function choose(value: string | undefined) {
    if (!field) return;
    go(period, { ...filters, [field.filterKey]: value });
    setOpen(false);
  }

  const selected = field ? filters[field.filterKey] : undefined;
  const values = field
    ? (options.data ?? []).map((option) => option.label)
    : [];
  // A filter coming from the URL stays visible even when it has no visit in this period.
  if (selected && !values.includes(selected)) values.unshift(selected);
  const needle = search.trim().toLocaleLowerCase("fr");
  const matches = field
    ? values.filter((value) =>
        optionLabel(field.filterKey, value)
          .toLocaleLowerCase("fr")
          .includes(needle),
      )
    : [];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-medium transition-colors hover:border-foreground/35 data-popup-open:border-foreground">
          <ListFilter aria-hidden className="size-4" />
          Filtrer
          {activeCount > 0 ? (
            <span className="grid size-5 place-items-center rounded-full bg-foreground text-[11px] text-background tabular-nums">
              {activeCount}
            </span>
          ) : null}
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 gap-1 rounded-2xl p-1.5">
          {!field ? (
            <>
              <p className="px-2.5 pt-1 pb-1.5 text-xs font-medium text-muted-foreground">
                Filtrer par
              </p>
              {FIELDS.map((candidate) => (
                <button
                  key={candidate.filterKey}
                  type="button"
                  className={item}
                  onClick={() => setFieldKey(candidate.filterKey)}
                >
                  <span className="font-medium">{candidate.label}</span>
                  {filters[candidate.filterKey] ? (
                    <span className="ml-auto max-w-32 truncate text-xs text-muted-foreground">
                      {formatFilterValue(
                        candidate.filterKey,
                        filters[candidate.filterKey] as string,
                      )}
                    </span>
                  ) : null}
                  <ChevronRight
                    aria-hidden
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground",
                      !filters[candidate.filterKey] && "ml-auto",
                    )}
                  />
                </button>
              ))}
            </>
          ) : (
            <>
              <button
                type="button"
                className={cn(item, "font-medium")}
                onClick={() => setFieldKey(null)}
              >
                <ChevronLeft aria-hidden className="size-4" />
                {field.label}
              </button>
              <label className="mx-1 mb-1 flex items-center gap-2 rounded-lg border border-border px-2.5 focus-within:border-foreground">
                <Search aria-hidden className="size-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher…"
                  aria-label={`Rechercher une valeur de ${field.label.toLowerCase()}`}
                  className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
              <div className="max-h-64 overflow-y-auto overscroll-contain">
                {selected ? (
                  <button
                    type="button"
                    className={cn(item, "text-muted-foreground")}
                    onClick={() => choose(undefined)}
                  >
                    Retirer ce filtre
                  </button>
                ) : null}
                {options.isError ? (
                  <p className="px-2.5 py-2 text-sm text-muted-foreground">
                    Impossible de charger les valeurs.
                  </p>
                ) : !options.data && !selected ? (
                  <p
                    className="px-2.5 py-2 text-sm text-muted-foreground"
                    aria-live="polite"
                  >
                    Chargement…
                  </p>
                ) : matches.length === 0 ? (
                  <p className="px-2.5 py-2 text-sm text-muted-foreground">
                    {values.length === 0
                      ? "Aucune valeur sur cette période."
                      : "Aucun résultat"}
                  </p>
                ) : (
                  matches.map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={value === selected}
                      className={item}
                      onClick={() => choose(value)}
                    >
                      <span className="min-w-0 truncate">
                        {optionLabel(field.filterKey, value)}
                      </span>
                      {value === selected ? (
                        <Check
                          aria-hidden
                          className="ml-auto size-4 shrink-0"
                        />
                      ) : null}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
      <ActiveFilters basePath={basePath} period={period} filters={filters} />
    </div>
  );
}
