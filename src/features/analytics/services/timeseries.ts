import { and, asc, count, countDistinct, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { event } from "@/db/schema";
import { getOwnedSite } from "@/features/sites";
import type { Period } from "../schemas/period";
import type { TimeseriesPoint } from "../types/analytics";
import { getPeriodRange } from "../utils/period";

const BUCKET_MS = { hour: 60 * 60 * 1000, day: 24 * 60 * 60 * 1000 } as const;

/** Visitors and pageviews per bucket (UTC), with empty buckets filled so the curve has no gap. */
export async function getTimeseries(userId: string, siteId: string, period: Period): Promise<TimeseriesPoint[]> {
  await getOwnedSite(userId, siteId);
  const { from, to, unit } = getPeriodRange(period);

  // `unit` comes from a closed union, never from user input.
  const bucket = sql<string>`to_char(date_trunc(${sql.raw(`'${unit}'`)}, ${event.createdAt} at time zone 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`;

  const rows = await db
    .select({ date: bucket, visitors: countDistinct(event.visitorHash), pageviews: count() })
    .from(event)
    .where(and(eq(event.siteId, siteId), gte(event.createdAt, from), lt(event.createdAt, to)))
    .groupBy(bucket)
    .orderBy(asc(bucket));

  const byDate = new Map(rows.map((row) => [row.date, row]));
  const step = BUCKET_MS[unit];
  const first = Math.floor(from.getTime() / step) * step;
  const points: TimeseriesPoint[] = [];

  for (let time = first; time < to.getTime(); time += step) {
    const date = new Date(time).toISOString().replace(/\.\d{3}Z$/, "Z");
    points.push({ date, visitors: byDate.get(date)?.visitors ?? 0, pageviews: byDate.get(date)?.pageviews ?? 0 });
  }

  return points;
}
