import type { NextRequest } from "next/server";
import {
  getSessions,
  handleSiteRequest,
  pageNumberSchema,
  parseDashboardQuery,
  toSearchParamsRecord,
} from "@/features/analytics";

export function GET(
  request: NextRequest,
  context: RouteContext<"/api/sites/[siteId]/sessions">,
) {
  return handleSiteRequest(
    request,
    context,
    ({ userId, siteId, searchParams }) => {
      const { period, filters } = parseDashboardQuery(
        toSearchParamsRecord(searchParams),
      );
      // `visits` is the page number of the list; the `page` filter is a page path.
      return getSessions(
        userId,
        siteId,
        period,
        filters,
        pageNumberSchema.parse(searchParams.get("visits") ?? undefined),
      );
    },
  );
}
