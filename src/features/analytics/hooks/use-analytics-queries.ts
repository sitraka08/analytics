"use client";

import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import type { Overview, RankingDimension, RankingItem, TimeseriesPoint } from "../types/analytics";
import type { SessionsPage } from "../types/session";
import { analyticsKeys } from "../utils/query-keys";
import { buildDashboardQuery } from "../utils/search-params";

async function fetchAnalytics<T>(siteId: string, path: string, period: Period, filters: Filters, signal: AbortSignal, extra = ""): Promise<T> {
  const query = [buildDashboardQuery(period, filters), extra].filter(Boolean).join("&");
  const response = await fetch(`/api/sites/${siteId}/${path}${query ? `?${query}` : ""}`, { signal });
  if (!response.ok) throw new Error(`Analytics request failed (${response.status})`);
  return response.json();
}

// `placeholderData` keeps the previous numbers on screen while a new period or filter loads.
const keepPrevious = { placeholderData: keepPreviousData };

export const rankingQueryOptions = (siteId: string, dimension: RankingDimension, period: Period, filters: Filters, limit?: number) =>
  queryOptions({
    queryKey: analyticsKeys.ranking(siteId, dimension, period, filters, limit),
    queryFn: ({ signal }) => fetchAnalytics<RankingItem[]>(siteId, `ranking/${dimension}`, period, filters, signal, limit ? `limit=${limit}` : ""),
    ...keepPrevious,
  });

export function useOverviewQuery(siteId: string, period: Period, filters: Filters) {
  return useQuery({
    queryKey: analyticsKeys.overview(siteId, period, filters),
    queryFn: ({ signal }) => fetchAnalytics<Overview>(siteId, "overview", period, filters, signal),
    ...keepPrevious,
  });
}

export function useTimeseriesQuery(siteId: string, period: Period, filters: Filters) {
  return useQuery({
    queryKey: analyticsKeys.timeseries(siteId, period, filters),
    queryFn: ({ signal }) => fetchAnalytics<TimeseriesPoint[]>(siteId, "timeseries", period, filters, signal),
    ...keepPrevious,
  });
}

export function useRankingQuery(siteId: string, dimension: RankingDimension, period: Period, filters: Filters, limit?: number) {
  return useQuery(rankingQueryOptions(siteId, dimension, period, filters, limit));
}

export function useSessionsQuery(siteId: string, period: Period, filters: Filters, page = 1) {
  return useQuery({
    queryKey: analyticsKeys.sessions(siteId, period, filters, page),
    queryFn: ({ signal }) => fetchAnalytics<SessionsPage>(siteId, "sessions", period, filters, signal, page > 1 ? `visits=${page}` : ""),
    ...keepPrevious,
  });
}
