import { and, eq, gte, lt } from "drizzle-orm";
import { event } from "@/db/schema";
import type { Filters } from "../schemas/filters";

/** Columns a filter can target; the keys are a closed set validated by `filtersSchema`. */
export const FILTER_COLUMN = {
  page: event.path,
  referrer: event.referrerDomain,
  country: event.country,
  device: event.device,
} as const;

export function eventConditions(siteId: string, from: Date, to: Date, filters: Filters) {
  return and(
    eq(event.siteId, siteId),
    gte(event.createdAt, from),
    lt(event.createdAt, to),
    ...(Object.keys(FILTER_COLUMN) as (keyof Filters)[]).map((key) =>
      filters[key] ? eq(FILTER_COLUMN[key], filters[key]) : undefined,
    ),
  );
}
