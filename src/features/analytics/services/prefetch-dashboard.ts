import "server-only";
import type { QueryClient } from "@tanstack/react-query";
import { RANKING_LIMIT, MAP_COUNTRIES } from "../constants/ranking";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import type { RankingDimension } from "../types/analytics";
import { analyticsKeys } from "../utils/query-keys";
import { getOverview } from "./overview";
import { getRanking } from "./ranking";
import { getSessions } from "./sessions";
import { getTimeseries } from "./timeseries";

const CARD_DIMENSIONS: RankingDimension[] = ["pages", "referrers", "cities", "devices"];

/**
 * Starts every query of the site dashboard without waiting for them: the pending queries are streamed to the
 * client through `dehydrate`, so the page shell shows at once and each widget fills in as its data arrives.
 * Keys come from `analyticsKeys`, the same ones the client hooks use.
 */
export function prefetchSiteDashboard(queryClient: QueryClient, userId: string, siteId: string, period: Period, filters: Filters) {
  const ranking = (dimension: RankingDimension, rankingFilters: Filters, limit: number) =>
    queryClient.prefetchQuery({
      queryKey: analyticsKeys.ranking(siteId, dimension, period, rankingFilters, limit),
      queryFn: () => getRanking(userId, siteId, period, rankingFilters, dimension, limit),
    });

  void queryClient.prefetchQuery({ queryKey: analyticsKeys.overview(siteId, period, filters), queryFn: () => getOverview(userId, siteId, period, filters) });
  void queryClient.prefetchQuery({ queryKey: analyticsKeys.timeseries(siteId, period, filters), queryFn: () => getTimeseries(userId, siteId, period, filters) });
  void queryClient.prefetchQuery({
    queryKey: analyticsKeys.sessions(siteId, period, filters, 1),
    queryFn: () => getSessions(userId, siteId, period, filters, 1),
  });
  void ranking("countries", filters, MAP_COUNTRIES);
  for (const dimension of CARD_DIMENSIONS) void ranking(dimension, filters, RANKING_LIMIT);
}

