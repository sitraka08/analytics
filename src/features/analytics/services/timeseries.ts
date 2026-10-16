import { createClient } from "@/db/server";
import { getOwnedSite } from "@/features/sites";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import type { TimeseriesPoint } from "../types/analytics";
import { getPeriodRange } from "../utils/period";
import { bucketDates } from "./bucket";
import { filterParams } from "./filter-params";

/** Visitors and pageviews per bucket (UTC), with empty buckets filled so the curve has no gap. */
export async function getTimeseries(userId: string, siteId: string, period: Period, filters: Filters): Promise<TimeseriesPoint[]> {
  await getOwnedSite(userId, siteId);
  const { from, to, unit } = getPeriodRange(period);

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("analytics_timeseries", {
    p_site_id: siteId,
    p_unit: unit,
    p_from: from.toISOString(),
    p_to: to.toISOString(),
    ...filterParams(filters),
  });

  if (error) throw error;
  const byDate = new Map(data.map((row) => [row.bucket, row]));

  return bucketDates(from, to, unit).map((date) => ({
    date,
    visitors: byDate.get(date)?.visitors ?? 0,
    pageviews: byDate.get(date)?.pageviews ?? 0,
  }));
}
