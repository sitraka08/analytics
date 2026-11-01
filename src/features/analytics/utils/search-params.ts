import { DEFAULT_PERIOD, type Period } from "../schemas/period";
import { FILTER_KEYS, type Filters } from "../schemas/filters";

/** Query string for a period and a set of filters; defaults are left out to keep it short. Also used for the API calls. */
export function buildDashboardQuery(period: Period, filters: Filters) {
  const params = new URLSearchParams();
  if (period.preset !== DEFAULT_PERIOD.preset) params.set("period", period.preset);
  if (period.preset === "custom") {
    params.set("from", period.from);
    params.set("to", period.to);
  }
  if (period.preset === "today" || period.preset === "custom") params.set("tz", period.tz);
  for (const key of FILTER_KEYS) {
    const value = filters[key];
    if (value) params.set(key, value);
  }

  return params.toString();
}

/** Dashboard URL for a period and a set of filters. */
export function buildDashboardHref(basePath: string, period: Period, filters: Filters) {
  const query = buildDashboardQuery(period, filters);
  return query ? `${basePath}?${query}` : basePath;
}

export function hasActiveFilters(filters: Filters) {
  return FILTER_KEYS.some((key) => Boolean(filters[key]));
}
