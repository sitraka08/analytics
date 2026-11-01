import { filtersSchema, type Filters } from "../schemas/filters";
import { parsePeriod, type Period } from "../schemas/period";

type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (typeof value === "string" ? value : undefined);

/** Period and filters from page search params or an API request: invalid values fall back to defaults. */
export function parseDashboardQuery(query: SearchParams): { period: Period; filters: Filters } {
  return {
    period: parsePeriod(query),
    filters: filtersSchema.parse({
      page: first(query.page),
      referrer: first(query.referrer),
      country: first(query.country),
      city: first(query.city),
      device: first(query.device),
    }),
  };
}

export function toSearchParamsRecord(params: URLSearchParams): SearchParams {
  return Object.fromEntries(params.entries());
}
