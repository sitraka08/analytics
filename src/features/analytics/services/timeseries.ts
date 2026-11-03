import { sql } from "drizzle-orm";
import { db } from "@/db";
import { getOwnedSite } from "@/features/sites";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import type { TimeseriesPoint } from "../types/analytics";
import { getPeriodRange } from "../utils/period";
import { bucketDates } from "./bucket";
import { filterArgs } from "./filter-params";

/** Visitors and pageviews per bucket (in the period's time zone), with empty buckets filled so the curve has no gap. */
export async function getTimeseries(
  userId: string,
  siteId: string,
  period: Period,
  filters: Filters,
): Promise<TimeseriesPoint[]> {
  await getOwnedSite(userId, siteId);
  const { from, to, unit, tz } = getPeriodRange(period);

  const { rows } = await db.execute<{
    bucket: string;
    visitors: number;
    pageviews: number;
  }>(
    sql`select * from analytics_timeseries(p_user_id => ${userId}::text, p_site_id => ${siteId}::uuid, p_unit => ${unit}::text, p_from => ${from.toISOString()}::timestamptz, p_to => ${to.toISOString()}::timestamptz, p_tz => ${tz}::text, ${filterArgs(filters)})`,
  );
  const byDate = new Map(rows.map((row) => [row.bucket, row]));

  return bucketDates(from, to, unit, tz).map((date) => ({
    date,
    visitors: byDate.get(date)?.visitors ?? 0,
    pageviews: byDate.get(date)?.pageviews ?? 0,
  }));
}
