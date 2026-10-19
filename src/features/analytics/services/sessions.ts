import { createClient } from "@/db/server";
import { getOwnedSite } from "@/features/sites";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import type { SessionDetail, SessionsPage } from "../types/session";
import { getPeriodRange } from "../utils/period";
import { filterParams } from "./filter-params";

export const SESSIONS_PAGE_SIZE = 25;

export class SessionNotFoundError extends Error {
  constructor() {
    super("Session not found");
    this.name = "SessionNotFoundError";
  }
}

/** Visits of a period, newest first. `page` starts at 1. */
export async function getSessions(userId: string, siteId: string, period: Period, filters: Filters, page: number): Promise<SessionsPage> {
  await getOwnedSite(userId, siteId);
  const { from, to } = getPeriodRange(period);

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("analytics_sessions", {
    p_site_id: siteId,
    p_from: from.toISOString(),
    p_to: to.toISOString(),
    p_limit: SESSIONS_PAGE_SIZE,
    p_offset: (page - 1) * SESSIONS_PAGE_SIZE,
    ...filterParams(filters),
  });
  if (error) throw error;

  return {
    sessions: data.map((row) => ({
      id: row.session_id,
      startedAt: row.started_at,
      country: row.country,
      region: row.region,
      city: row.city,
      device: row.device,
      browser: row.browser,
      os: row.os,
      referrerDomain: row.referrer_domain,
      utmSource: row.utm_source,
      entryPath: row.entry_path,
      pageviews: row.pageviews,
      durationMs: row.duration_ms,
    })),
    total: data[0]?.total_count ?? 0,
    page,
    pageSize: SESSIONS_PAGE_SIZE,
  };
}

/** One visit with its page views in order; the place, device and source are those of the first page view. */
export async function getSession(userId: string, siteId: string, sessionId: string): Promise<SessionDetail> {
  await getOwnedSite(userId, siteId);

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("analytics_session_events", { p_site_id: siteId, p_session_id: sessionId });
  if (error) throw error;

  const first = data[0];
  if (!first) throw new SessionNotFoundError();

  const measured = data.filter((row) => row.duration_ms !== null);

  return {
    id: sessionId,
    startedAt: first.created_at,
    country: first.country,
    region: first.region,
    city: first.city,
    device: first.device,
    browser: first.browser,
    os: first.os,
    referrerDomain: first.referrer_domain,
    utmSource: first.utm_source,
    utmMedium: first.utm_medium,
    utmCampaign: first.utm_campaign,
    durationMs: measured.length > 0 ? measured.reduce((total, row) => total + (row.duration_ms ?? 0), 0) : null,
    pageviews: data.map((row) => ({ at: row.created_at, path: row.path, durationMs: row.duration_ms })),
  };
}
