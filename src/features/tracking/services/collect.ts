import { randomUUID } from "node:crypto";
import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { event } from "@/db/schema/event";
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
  region: string | null;
  city: string | null;
};

export type CollectResult =
  | { status: "accepted"; allowOrigin: string }
  // Unknown key or bot: answered like a success so the endpoint reveals nothing.
  | { status: "ignored" }
  | { status: "forbidden" }
  | { status: "rate-limited" };

export async function collectEvent({
  payload,
  origin,
  ip,
  userAgent,
  country,
  region,
  city,
}: CollectRequest): Promise<CollectResult> {
  if (isRateLimited(`${ip}:${payload.key}`)) return { status: "rate-limited" };

  const site = await findSiteForCollection(payload.key);
  if (!site) return { status: "ignored" };
  if (!origin || !isAllowedOrigin(origin, site.domain))
    return { status: "forbidden" };
  if (isBot(userAgent) || !userAgent) return { status: "ignored" };

  if (payload.type === "duration") {
    await db
      .update(event)
      .set({ durationMs: payload.duration })
      .where(and(eq(event.id, payload.id), eq(event.siteId, site.id)));
    return { status: "accepted", allowOrigin: origin };
  }

  const now = new Date();
  const visitorHash = getVisitorHash({ siteId: site.id, ip, userAgent, now });
  const page = parsePageUrl(payload.url);
  const { device, browser, os } = parseUserAgent(userAgent);

  // A session continues while the visitor's last event is less than 30 minutes old.
  const [recent] = await db
    .select({ sessionId: event.sessionId })
    .from(event)
    .where(
      and(
        eq(event.siteId, site.id),
        eq(event.visitorHash, visitorHash),
        gte(event.createdAt, new Date(now.getTime() - SESSION_INACTIVITY_MS)),
      ),
    )
    .orderBy(desc(event.createdAt))
    .limit(1);

  await db
    .insert(event)
    .values({
      id: payload.id,
      siteId: site.id,
      createdAt: now,
      path: page.path,
      referrerDomain: getReferrerDomain(payload.referrer, site.domain),
      utmSource: page.utmSource,
      utmMedium: page.utmMedium,
      utmCampaign: page.utmCampaign,
      country,
      region,
      city,
      device,
      browser,
      os,
      visitorHash,
      sessionId: recent?.sessionId ?? randomUUID(),
    })
    .onConflictDoNothing({ target: event.id });

  return { status: "accepted", allowOrigin: origin };
}
