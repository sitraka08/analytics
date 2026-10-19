import { createClient } from "@/db/server";
import { getOwnedSite } from "@/features/sites";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import type { RankingDimension, RankingItem } from "../types/analytics";
import { getPeriodRange } from "../utils/period";
import { filterParams } from "./filter-params";

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

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("analytics_ranking", {
    p_site_id: siteId,
    p_dimension: dimension,
    p_from: from.toISOString(),
    p_to: to.toISOString(),
    p_limit: limit,
    ...filterParams(filters),
  });

  if (error) throw error;
  return data;
}
