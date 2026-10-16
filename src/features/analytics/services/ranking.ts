import { and, countDistinct, desc, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { event } from "@/db/schema";
import { getOwnedSite } from "@/features/sites";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import type { RankingDimension, RankingItem } from "../types/analytics";
import { getPeriodRange } from "../utils/period";
import { eventConditions } from "./event-conditions";

const DEFAULT_LIMIT = 8;

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
  filters: Filters,
  dimension: RankingDimension,
  limit = DEFAULT_LIMIT,
): Promise<RankingItem[]> {
  await getOwnedSite(userId, siteId);
  const { from, to } = getPeriodRange(period);
  const column = DIMENSION_COLUMN[dimension];
  const visitors = countDistinct(event.visitorHash);

  const rows = await db
    .select({ label: column, visitors })
    .from(event)
    .where(and(eventConditions(siteId, from, to, filters), isNotNull(column)))
    .groupBy(column)
    .orderBy(desc(visitors))
    .limit(limit);

  // The `isNotNull` filter guarantees a label; the column types stay nullable.
  return rows.map((row) => ({ label: row.label as string, visitors: row.visitors }));
}
