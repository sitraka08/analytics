import type { NextRequest } from "next/server";
import {
  getRanking,
  handleSiteRequest,
  parseDashboardQuery,
  rankingDimensionSchema,
  rankingLimitSchema,
  toSearchParamsRecord,
} from "@/features/analytics";

export function GET(request: NextRequest, context: RouteContext<"/api/sites/[siteId]/ranking/[dimension]">) {
  return handleSiteRequest(request, context, ({ userId, siteId, searchParams, params }) => {
    const dimension = rankingDimensionSchema.parse(params.dimension);
    const { period, filters } = parseDashboardQuery(toSearchParamsRecord(searchParams));
    return getRanking(userId, siteId, period, filters, dimension, rankingLimitSchema.parse(searchParams.get("limit") ?? undefined));
  });
}
