import { and, countDistinct, desc, eq, gte, isNotNull, lt } from "drizzle-orm";
import { db } from "@/db";
import { event } from "@/db/schema";
import { getOwnedSite } from "@/features/sites";
import type { Period } from "../schemas/period";
import type { RankingDimension, RankingItem } from "../types/analytics";
import { getPeriodRange } from "../utils/period";

const RANKING_LIMIT = 8;

const DIMENSION_COLUMN = {
  pages: event.path,
  referrers: event.referrerDomain,
  countries: event.country,
  devices: event.device,
} as const;

export async function getRanking(
  userId: string,
  siteId: string,
  period: Period,
  dimension: RankingDimension,
): Promise<RankingItem[]> {
  await getOwnedSite(userId, siteId);
  const { from, to } = getPeriodRange(period);
  const column = DIMENSION_COLUMN[dimension];
  const visitors = countDistinct(event.visitorHash);

  const rows = await db
    .select({ label: column, visitors })
    .from(event)
    .where(and(eq(event.siteId, siteId), gte(event.createdAt, from), lt(event.createdAt, to), isNotNull(column)))
    .groupBy(column)
    .orderBy(desc(visitors))
    .limit(RANKING_LIMIT);

  // The `isNotNull` filter guarantees a label; the column types stay nullable.
  return rows.map((row) => ({ label: row.label as string, visitors: row.visitors }));
}
