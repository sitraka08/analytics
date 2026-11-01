import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import type { RankingDimension } from "../types/analytics";

// Shared by the server prefetch and the client hooks: identical keys are what makes hydration hit the cache.
export const analyticsKeys = {
  all: (siteId: string) => ["analytics", siteId] as const,
  overview: (siteId: string, period: Period, filters: Filters) => ["analytics", siteId, "overview", period, filters] as const,
  timeseries: (siteId: string, period: Period, filters: Filters) => ["analytics", siteId, "timeseries", period, filters] as const,
  ranking: (siteId: string, dimension: RankingDimension, period: Period, filters: Filters, limit?: number) =>
    ["analytics", siteId, "ranking", dimension, limit ?? null, period, filters] as const,
  sessions: (siteId: string, period: Period, filters: Filters, page: number) => ["analytics", siteId, "sessions", page, period, filters] as const,
};
