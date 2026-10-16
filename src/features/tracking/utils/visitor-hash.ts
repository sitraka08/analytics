import { createHmac } from "node:crypto";

function getSecret(): string {
  const secret = process.env.VISITOR_SALT_SECRET;
  if (!secret) throw new Error("VISITOR_SALT_SECRET is not set");
  return secret;
}

/**
 * Anonymous visitor identifier: HMAC(daily salt, site + IP + user-agent).
 * The salt is derived from the server secret and the UTC date, so it is never stored and a visitor
 * cannot be linked from one day to the next. The inputs are discarded right after hashing.
 */
export function getVisitorHash(input: { siteId: string; ip: string; userAgent: string; now?: Date }): string {
  const day = (input.now ?? new Date()).toISOString().slice(0, 10);
  const dailySalt = createHmac("sha256", getSecret()).update(day).digest();
  return createHmac("sha256", dailySalt).update(`${input.siteId}|${input.ip}|${input.userAgent}`).digest("hex").slice(0, 32);
}
