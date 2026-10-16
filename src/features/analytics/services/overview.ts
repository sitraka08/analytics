import { and, count, countDistinct, eq, gte, lt, sql, sum } from "drizzle-orm";
import { db } from "@/db";
import { event } from "@/db/schema";
import { getOwnedSite } from "@/features/sites";
import type { Period } from "../schemas/period";
import type { Overview, Totals } from "../types/analytics";
import { getPeriodRange } from "../utils/period";

async function getTotals(siteId: string, from: Date, to: Date): Promise<Totals> {
  const inRange = and(eq(event.siteId, siteId), gte(event.createdAt, from), lt(event.createdAt, to));

  // One row per session: its pageview count and its summed measured duration.
  const sessions = db
    .select({ pageviews: count().as("pageviews"), durationMs: sum(event.durationMs).mapWith(Number).as("duration_ms") })
    .from(event)
    .where(inRange)
    .groupBy(event.sessionId)
    .as("sessions");

  const [[visitors], [aggregate]] = await Promise.all([
    db.select({ value: countDistinct(event.visitorHash) }).from(event).where(inRange),
    db
      .select({
        sessions: count(),
        pageviews: sql<number>`coalesce(sum(${sessions.pageviews}), 0)::int`,
        bounces: sql<number>`count(*) filter (where ${sessions.pageviews} = 1)::int`,
        avgDurationMs: sql<number | null>`avg(${sessions.durationMs}) filter (where ${sessions.durationMs} is not null)`,
      })
      .from(sessions),
  ]);

  return {
    visitors: visitors.value,
    pageviews: aggregate.pageviews,
    avgDurationMs: aggregate.avgDurationMs === null ? null : Number(aggregate.avgDurationMs),
    bounceRate: aggregate.sessions > 0 ? aggregate.bounces / aggregate.sessions : null,
  };
}

export async function getOverview(userId: string, siteId: string, period: Period): Promise<Overview> {
  await getOwnedSite(userId, siteId);
  const { from, to, previousFrom } = getPeriodRange(period);

  const [current, previous] = await Promise.all([getTotals(siteId, from, to), getTotals(siteId, previousFrom, from)]);
  return { current, previous };
}
