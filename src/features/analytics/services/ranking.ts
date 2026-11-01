import { sql } from "drizzle-orm";
import { db } from "@/db";
import { getOwnedSite } from "@/features/sites";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import type { RankingDimension, RankingItem } from "../types/analytics";
import { getPeriodRange } from "../utils/period";
import { filterArgs } from "./filter-params";

const DEFAULT_LIMIT = 30;

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

  const { rows } = await db.execute<RankingItem>(
    sql`select * from analytics_ranking(p_user_id => ${userId}::text, p_site_id => ${siteId}::uuid, p_dimension => ${dimension}::text, p_from => ${from.toISOString()}::timestamptz, p_to => ${to.toISOString()}::timestamptz, p_limit => ${limit}::integer, ${filterArgs(filters)})`,
  );

  return rows;
}
