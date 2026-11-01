"use client";

import { useQueries } from "@tanstack/react-query";
import { RANKING_LIMIT } from "../constants/ranking";
import { rankingQueryOptions } from "../hooks/use-analytics-queries";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import type { RankingDimension } from "../types/analytics";
import { countryFlag } from "../utils/country-flag";
import { formatFilterValue } from "../utils/filter-label";
import { FilterSelect, type FilterOption } from "./filter-select";

const FIELDS: { label: string; filterKey: keyof Filters; dimension: RankingDimension }[] = [
  { label: "Page", filterKey: "page", dimension: "pages" },
  { label: "Source", filterKey: "referrer", dimension: "referrers" },
  { label: "Pays", filterKey: "country", dimension: "countries" },
  { label: "Ville", filterKey: "city", dimension: "cities" },
  { label: "Appareil", filterKey: "device", dimension: "devices" },
];

type FilterBarProps = { siteId: string; period: Period; filters: Filters; basePath: string };

/** Options come from the period's own data, unfiltered, so a value can always be swapped for another. */
export function FilterBar({ siteId, period, filters, basePath }: FilterBarProps) {
  const lists = useQueries({ queries: FIELDS.map((field) => rankingQueryOptions(siteId, field.dimension, period, {}, RANKING_LIMIT)) });

  return (
    <div className="flex flex-wrap gap-3" role="group" aria-label="Filtres">
      {FIELDS.map((field, index) => {
        const values = (lists[index].data ?? []).map((item) => item.label);
        const selected = filters[field.filterKey];
        // A filter coming from the URL stays selectable even when it has no visit in this period (or while it loads).
        if (selected && !values.includes(selected)) values.unshift(selected);
        const options: FilterOption[] = values.map((value) => ({
          value,
          label: [field.filterKey === "country" ? countryFlag(value) : null, formatFilterValue(field.filterKey, value)].filter(Boolean).join(" "),
        }));

        return (
          <FilterSelect
            key={field.filterKey}
            label={field.label}
            filterKey={field.filterKey}
            options={options}
            basePath={basePath}
            period={period}
            filters={filters}
          />
        );
      })}
    </div>
  );
}
