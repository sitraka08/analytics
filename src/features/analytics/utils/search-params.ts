import { DEFAULT_PERIOD, type Period } from "../schemas/period";
import { FILTER_KEYS, type Filters } from "../schemas/filters";

/** Dashboard URL for a period and a set of filters; defaults are left out to keep links short. */
export function buildDashboardHref(basePath: string, period: Period, filters: Filters) {
  const params = new URLSearchParams();
  if (period !== DEFAULT_PERIOD) params.set("period", period);
  for (const key of FILTER_KEYS) {
    const value = filters[key];
    if (value) params.set(key, value);
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function hasActiveFilters(filters: Filters) {
  return FILTER_KEYS.some((key) => Boolean(filters[key]));
}
