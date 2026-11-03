import { sql } from "drizzle-orm";
import { db } from "@/db";
import { getOwnedSite } from "@/features/sites";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import type { SessionDetail, SessionsPage } from "../types/session";
import { getPeriodRange } from "../utils/period";
import { filterArgs } from "./filter-params";

export const SESSIONS_PAGE_SIZE = 25;

type Place = {
  country: string | null;
  region: string | null;
  city: string | null;
};
type Device = {
  device: string | null;
  browser: string | null;
  os: string | null;
};

type SessionRow = Place &
  Device & {
    session_id: string;
    // Drizzle returns timestamps from `db.execute` as text ("2026-11-01 09:36:57.414+00").
    started_at: string;
    referrer_domain: string | null;
    utm_source: string | null;
    entry_path: string;
    pageviews: number;
    duration_ms: string | null;
    total_count: number;
  };

type SessionEventRow = Place &
  Device & {
    created_at: string;
    path: string;
    duration_ms: number | null;
    referrer_domain: string | null;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
  };

export class SessionNotFoundError extends Error {
  constructor() {
    super("Session not found");
    this.name = "SessionNotFoundError";
  }
}

/** Visits of a period, newest first. `page` starts at 1. */
export async function getSessions(
  userId: string,
  siteId: string,
  period: Period,
  filters: Filters,
  page: number,
): Promise<SessionsPage> {
  await getOwnedSite(userId, siteId);
  const { from, to } = getPeriodRange(period);

  const { rows: data } = await db.execute<SessionRow>(
    sql`select * from analytics_sessions(p_user_id => ${userId}::text, p_site_id => ${siteId}::uuid, p_from => ${from.toISOString()}::timestamptz, p_to => ${to.toISOString()}::timestamptz, p_limit => ${SESSIONS_PAGE_SIZE}::integer, p_offset => ${(page - 1) * SESSIONS_PAGE_SIZE}::integer, ${filterArgs(filters)})`,
  );

  return {
    sessions: data.map((row) => ({
      id: row.session_id,
      startedAt: new Date(row.started_at).toISOString(),
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
      // `bigint` comes back from the driver as a string.
      durationMs: row.duration_ms === null ? null : Number(row.duration_ms),
    })),
    total: data[0]?.total_count ?? 0,
    page,
    pageSize: SESSIONS_PAGE_SIZE,
  };
}

/** One visit with its page views in order; the place, device and source are those of the first page view. */
export async function getSession(
  userId: string,
  siteId: string,
  sessionId: string,
): Promise<SessionDetail> {
  await getOwnedSite(userId, siteId);

  const { rows: data } = await db.execute<SessionEventRow>(
    sql`select * from analytics_session_events(p_user_id => ${userId}::text, p_site_id => ${siteId}::uuid, p_session_id => ${sessionId}::text)`,
  );

  const first = data[0];
  if (!first) throw new SessionNotFoundError();

  const measured = data.filter((row) => row.duration_ms !== null);

  return {
    id: sessionId,
    startedAt: new Date(first.created_at).toISOString(),
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
    durationMs:
      measured.length > 0
        ? measured.reduce((total, row) => total + (row.duration_ms ?? 0), 0)
        : null,
    pageviews: data.map((row) => ({
      at: new Date(row.created_at).toISOString(),
      path: row.path,
      durationMs: row.duration_ms,
    })),
  };
}
