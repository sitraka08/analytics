import { sql } from "drizzle-orm";
import { db } from "@/db";
import { getOwnedSite } from "@/features/sites";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import type { Overview, Totals } from "../types/analytics";
import { getPeriodRange } from "../utils/period";
import { filterArgs } from "./filter-params";

type TotalsRow = { visitors: number; sessions: number; pageviews: number; bounces: number; avg_duration_ms: number | null };

async function getTotals(userId: string, siteId: string, from: Date, to: Date, filters: Filters): Promise<Totals> {
  const { rows } = await db.execute<TotalsRow>(
    sql`select * from analytics_totals(p_user_id => ${userId}::text, p_site_id => ${siteId}::uuid, p_from => ${from.toISOString()}::timestamptz, p_to => ${to.toISOString()}::timestamptz, ${filterArgs(filters)})`,
  );
  const data = rows[0];

  return {
    visitors: data.visitors,
    pageviews: data.pageviews,
    avgDurationMs: data.avg_duration_ms,
    bounceRate: data.sessions > 0 ? data.bounces / data.sessions : null,
  };
}

export async function getOverview(userId: string, siteId: string, period: Period, filters: Filters): Promise<Overview> {
  await getOwnedSite(userId, siteId);
  const { from, to, previousFrom } = getPeriodRange(period);

  const [current, previous] = await Promise.all([getTotals(userId, siteId, from, to, filters), getTotals(userId, siteId, previousFrom, from, filters)]);
  return { current, previous };
}
