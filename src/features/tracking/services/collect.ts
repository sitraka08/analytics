import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/db/admin";
import { findSiteForCollection } from "@/features/sites";
import type { CollectPayload } from "../schemas/collect";
import { isBot } from "../utils/bot-filter";
import { isAllowedOrigin } from "../utils/origin";
import { getReferrerDomain, parsePageUrl } from "../utils/page-url";
import { parseUserAgent } from "../utils/parse-user-agent";
import { isRateLimited } from "../utils/rate-limit";
import { getVisitorHash } from "../utils/visitor-hash";

const SESSION_INACTIVITY_MS = 30 * 60 * 1000;

type CollectRequest = {
  payload: CollectPayload;
  origin: string | null;
  ip: string;
  userAgent: string | null;
  country: string | null;
};

export type CollectResult =
  | { status: "accepted"; allowOrigin: string }
  // Unknown key or bot: answered like a success so the endpoint reveals nothing.
  | { status: "ignored" }
  | { status: "forbidden" }
  | { status: "rate-limited" };

export async function collectEvent({ payload, origin, ip, userAgent, country }: CollectRequest): Promise<CollectResult> {
  if (isRateLimited(`${ip}:${payload.key}`)) return { status: "rate-limited" };

  const site = await findSiteForCollection(payload.key);
  if (!site) return { status: "ignored" };
  if (!origin || !isAllowedOrigin(origin, site.domain)) return { status: "forbidden" };
  if (isBot(userAgent) || !userAgent) return { status: "ignored" };

  const supabase = createAdminClient();

  if (payload.type === "duration") {
    const { error } = await supabase.from("event").update({ duration_ms: payload.duration }).eq("id", payload.id).eq("site_id", site.id);
    if (error) throw error;
    return { status: "accepted", allowOrigin: origin };
  }

  const now = new Date();
  const visitorHash = getVisitorHash({ siteId: site.id, ip, userAgent, now });
  const page = parsePageUrl(payload.url);
  const { device, browser, os } = parseUserAgent(userAgent);

  // A session continues while the visitor's last event is less than 30 minutes old.
  const { data: recent, error: recentError } = await supabase
    .from("event")
    .select("session_id")
    .eq("site_id", site.id)
    .eq("visitor_hash", visitorHash)
    .gte("created_at", new Date(now.getTime() - SESSION_INACTIVITY_MS).toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (recentError) throw recentError;

  const { error } = await supabase.from("event").upsert(
    {
      id: payload.id,
      site_id: site.id,
      created_at: now.toISOString(),
      path: page.path,
      referrer_domain: getReferrerDomain(payload.referrer, site.domain),
      utm_source: page.utmSource,
      utm_medium: page.utmMedium,
      utm_campaign: page.utmCampaign,
      country,
      device,
      browser,
      os,
      visitor_hash: visitorHash,
      session_id: recent?.session_id ?? randomUUID(),
    },
    { onConflict: "id", ignoreDuplicates: true },
  );
  if (error) throw error;

  return { status: "accepted", allowOrigin: origin };
}
