import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import { getRanking } from "../services/ranking";
import type { RankingDimension } from "../types/analytics";
import { countryFlag } from "../utils/country-flag";
import { formatFilterValue } from "../utils/filter-label";
import { FilterSelect, type FilterOption } from "./filter-select";

const OPTIONS_LIMIT = 30;

const FIELDS: { label: string; filterKey: keyof Filters; dimension: RankingDimension }[] = [
  { label: "Page", filterKey: "page", dimension: "pages" },
  { label: "Source", filterKey: "referrer", dimension: "referrers" },
  { label: "Pays", filterKey: "country", dimension: "countries" },
  { label: "Appareil", filterKey: "device", dimension: "devices" },
];

type FilterBarProps = { userId: string; siteId: string; period: Period; filters: Filters; basePath: string };

/** Options come from the period's own data, unfiltered, so a value can always be swapped for another. */
export async function FilterBar({ userId, siteId, period, filters, basePath }: FilterBarProps) {
  const lists = await Promise.all(FIELDS.map((field) => getRanking(userId, siteId, period, {}, field.dimension, OPTIONS_LIMIT)));

  return (
    <div className="flex flex-wrap gap-3" role="group" aria-label="Filtres">
      {FIELDS.map((field, index) => {
        const values = lists[index].map((item) => item.label);
        const selected = filters[field.filterKey];
        // A filter coming from the URL stays selectable even when it has no visit in this period.
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
