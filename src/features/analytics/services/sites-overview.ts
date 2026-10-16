import { createClient } from "@/db/server";
import { listSites } from "@/features/sites";
import type { Period } from "../schemas/period";
import type { SitesOverview, TimeseriesPoint } from "../types/analytics";
import { getPeriodRange } from "../utils/period";
import { bucketDates } from "./bucket";

/** Totals and curves of every site the user owns, in two grouped queries. */
export async function getSitesOverview(userId: string, period: Period): Promise<SitesOverview> {
  // Site ids come from the user's own sites: nothing from the client reaches the queries.
  const sites = await listSites(userId);
  const { from, to, previousFrom, unit } = getPeriodRange(period);
  const dates = bucketDates(from, to, unit);
  const empty = dates.map((date): TimeseriesPoint => ({ date, visitors: 0, pageviews: 0 }));

  if (sites.length === 0) return { sites: [], points: empty };

  const siteIds = sites.map((item) => item.id);
  const supabase = await createClient();

  const [totalsResult, seriesResult] = await Promise.all([
    supabase.rpc("analytics_sites_totals", {
      p_site_ids: siteIds,
      p_previous_from: previousFrom.toISOString(),
      p_from: from.toISOString(),
      p_to: to.toISOString(),
    }),
    supabase.rpc("analytics_sites_series", { p_site_ids: siteIds, p_unit: unit, p_from: from.toISOString(), p_to: to.toISOString() }),
  ]);

  if (totalsResult.error) throw totalsResult.error;
  if (seriesResult.error) throw seriesResult.error;
  const { data: totals } = totalsResult;
  const { data: series } = seriesResult;

  const totalsBySite = new Map(totals.map((row) => [row.site_id, row]));
  const seriesBySite = new Map<string, Map<string, { visitors: number; pageviews: number }>>();
  const combined = new Map(empty.map((point) => [point.date, { ...point }]));

  for (const row of series) {
    const bySite = seriesBySite.get(row.site_id) ?? new Map();
    bySite.set(row.bucket, row);
    seriesBySite.set(row.site_id, bySite);

    const point = combined.get(row.bucket);
    if (point) {
      point.visitors += row.visitors;
      point.pageviews += row.pageviews;
    }
  }

  return {
    sites: sites.map((item) => {
      const total = totalsBySite.get(item.id);
      const bySite = seriesBySite.get(item.id);

      return {
        id: item.id,
        name: item.name,
        domain: item.domain,
        visitors: total?.visitors ?? 0,
        pageviews: total?.pageviews ?? 0,
        previousVisitors: total?.previous_visitors ?? 0,
        points: dates.map((date) => ({ date, visitors: bySite?.get(date)?.visitors ?? 0, pageviews: bySite?.get(date)?.pageviews ?? 0 })),
      };
    }),
    points: [...combined.values()],
  };
}
