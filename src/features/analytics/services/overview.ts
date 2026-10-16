import { createClient } from "@/db/server";
import { getOwnedSite } from "@/features/sites";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import type { Overview, Totals } from "../types/analytics";
import { getPeriodRange } from "../utils/period";
import { filterParams } from "./filter-params";

async function getTotals(siteId: string, from: Date, to: Date, filters: Filters): Promise<Totals> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("analytics_totals", { p_site_id: siteId, p_from: from.toISOString(), p_to: to.toISOString(), ...filterParams(filters) })
    .single();

  if (error) throw error;

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

  const [current, previous] = await Promise.all([getTotals(siteId, from, to, filters), getTotals(siteId, previousFrom, from, filters)]);
  return { current, previous };
}
