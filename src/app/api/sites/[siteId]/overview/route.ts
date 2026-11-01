import type { NextRequest } from "next/server";
import { getOverview, handleSiteRequest, parseDashboardQuery, toSearchParamsRecord } from "@/features/analytics";

export function GET(request: NextRequest, context: RouteContext<"/api/sites/[siteId]/overview">) {
  return handleSiteRequest(request, context, ({ userId, siteId, searchParams }) => {
    const { period, filters } = parseDashboardQuery(toSearchParamsRecord(searchParams));
    return getOverview(userId, siteId, period, filters);
  });
}
