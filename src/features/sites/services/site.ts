import { randomBytes, randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { site } from "@/db/schema";
import type { SiteSummary } from "../types/site";

export class SiteNotFoundError extends Error {
  constructor() {
    super("Site not found");
    this.name = "SiteNotFoundError";
  }
}

const SITE_COLUMNS = {
  id: site.id,
  name: site.name,
  domain: site.domain,
  publicKey: site.publicKey,
  createdAt: site.createdAt,
} as const;

export async function createSite(userId: string, input: { name: string; domain: string }): Promise<SiteSummary> {
  const [created] = await db
    .insert(site)
    .values({
      id: randomUUID(),
      userId,
      name: input.name,
      domain: input.domain,
      publicKey: randomBytes(12).toString("base64url"),
    })
    .returning(SITE_COLUMNS);

  return created;
}

export async function listSites(userId: string): Promise<SiteSummary[]> {
  return db.select(SITE_COLUMNS).from(site).where(eq(site.userId, userId)).orderBy(desc(site.createdAt)).limit(50);
}

/** Public collection lookup (no user involved): only what is needed to accept an event. */
export async function findSiteForCollection(publicKey: string): Promise<{ id: string; domain: string } | null> {
  const [found] = await db
    .select({ id: site.id, domain: site.domain })
    .from(site)
    .where(eq(site.publicKey, publicKey))
    .limit(1);

  return found ?? null;
}

/**
 * The single ownership check: every service reading or writing a site's data calls it first.
 * A site owned by someone else is indistinguishable from a missing one.
 */
export async function getOwnedSite(userId: string, siteId: string): Promise<SiteSummary> {
  const [found] = await db
    .select(SITE_COLUMNS)
    .from(site)
    .where(and(eq(site.id, siteId), eq(site.userId, userId)))
    .limit(1);

  if (!found) throw new SiteNotFoundError();
  return found;
}
