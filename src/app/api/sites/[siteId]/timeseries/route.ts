import type { NextRequest } from "next/server";
import {
  getTimeseries,
  handleSiteRequest,
  parseDashboardQuery,
  toSearchParamsRecord,
} from "@/features/analytics";

export function GET(
  request: NextRequest,
  context: RouteContext<"/api/sites/[siteId]/timeseries">,
) {
  return handleSiteRequest(
    request,
    context,
    ({ userId, siteId, searchParams }) => {
      const { period, filters } = parseDashboardQuery(
        toSearchParamsRecord(searchParams),
      );
      return getTimeseries(userId, siteId, period, filters);
    },
  );
}
