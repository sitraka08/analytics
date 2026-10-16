import { randomBytes } from "node:crypto";
import { createAdminClient } from "@/db/admin";
import { createClient } from "@/db/server";
import type { Database } from "@/db/types";
import type { SiteSummary } from "../types/site";

export class SiteNotFoundError extends Error {
  constructor() {
    super("Site not found");
    this.name = "SiteNotFoundError";
  }
}

const SITE_COLUMNS = "id, name, domain, public_key, created_at";

type SiteColumns = Pick<Database["public"]["Tables"]["site"]["Row"], "id" | "name" | "domain" | "public_key" | "created_at">;

function toSummary(row: SiteColumns): SiteSummary {
  return { id: row.id, name: row.name, domain: row.domain, publicKey: row.public_key, createdAt: new Date(row.created_at) };
}

export async function createSite(userId: string, input: { name: string; domain: string }): Promise<SiteSummary> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site")
    .insert({ user_id: userId, name: input.name, domain: input.domain, public_key: randomBytes(12).toString("base64url") })
    .select(SITE_COLUMNS)
    .single();

  if (error) throw error;
  return toSummary(data);
}

export async function listSites(userId: string): Promise<SiteSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site")
    .select(SITE_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data.map(toSummary);
}

/** Public collection lookup (no user involved): only what is needed to accept an event. */
export async function findSiteForCollection(publicKey: string): Promise<{ id: string; domain: string } | null> {
  const { data, error } = await createAdminClient().from("site").select("id, domain").eq("public_key", publicKey).maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * The single ownership check: every service reading or writing a site's data calls it first.
 * A site owned by someone else is indistinguishable from a missing one.
 */
export async function getOwnedSite(userId: string, siteId: string): Promise<SiteSummary> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site").select(SITE_COLUMNS).eq("id", siteId).eq("user_id", userId).maybeSingle();

  if (error) throw error;
  if (!data) throw new SiteNotFoundError();
  return toSummary(data);
}
