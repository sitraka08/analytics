const DEV_HOSTNAMES = new Set(["localhost", "127.0.0.1"]);

/** The request must come from the site's own domain or one of its subdomains. */
export function isAllowedOrigin(
  origin: string | null,
  siteDomain: string,
): boolean {
  if (!origin) return false;

  let hostname: string;
  try {
    hostname = new URL(origin).hostname.toLowerCase();
  } catch {
    return false;
  }

  if (process.env.NODE_ENV !== "production" && DEV_HOSTNAMES.has(hostname))
    return true;
  return hostname === siteDomain || hostname.endsWith(`.${siteDomain}`);
}
