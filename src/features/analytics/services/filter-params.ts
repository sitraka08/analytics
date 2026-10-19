import type { Filters } from "../schemas/filters";

/** Maps the validated URL filters to the optional parameters of the `analytics_*` SQL functions. */
export function filterParams(filters: Filters) {
  return { p_page: filters.page ?? null, p_referrer: filters.referrer ?? null, p_country: filters.country ?? null, p_city: filters.city ?? null, p_device: filters.device ?? null };
}
