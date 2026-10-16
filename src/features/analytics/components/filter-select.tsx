"use client";

import { useRouter } from "next/navigation";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import { buildDashboardHref } from "../utils/search-params";

export type FilterOption = { value: string; label: string };

type FilterSelectProps = {
  label: string;
  filterKey: keyof Filters;
  options: FilterOption[];
  basePath: string;
  period: Period;
  filters: Filters;
};

export function FilterSelect({ label, filterKey, options, basePath, period, filters }: FilterSelectProps) {
  const router = useRouter();

  return (
    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
      {label}
      <select
        value={filters[filterKey] ?? ""}
        onChange={(event) =>
          router.push(buildDashboardHref(basePath, period, { ...filters, [filterKey]: event.target.value || undefined }), {
            scroll: false,
          })
        }
        className="h-10 min-w-40 rounded-full border-2 border-foreground/15 bg-surface px-4 text-sm text-foreground hover:border-foreground/35 focus-visible:border-foreground focus-visible:outline-none"
      >
        <option value="">Tous</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
