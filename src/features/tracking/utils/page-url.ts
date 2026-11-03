const MAX_PATH_LENGTH = 500;
const MAX_UTM_LENGTH = 100;

export type PageInfo = {
  path: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

function readUtm(params: URLSearchParams, name: string): string | null {
  const value = params.get(name)?.trim().slice(0, MAX_UTM_LENGTH);
  return value || null;
}

/** Keeps the path and the UTM parameters only: the rest of the query string and the hash are dropped. */
export function parsePageUrl(url: string): PageInfo {
  const { pathname, searchParams } = new URL(url);
  return {
    path: pathname.slice(0, MAX_PATH_LENGTH) || "/",
    utmSource: readUtm(searchParams, "utm_source"),
    utmMedium: readUtm(searchParams, "utm_medium"),
    utmCampaign: readUtm(searchParams, "utm_campaign"),
  };
}

/** Referrer reduced to its domain; navigation inside the site itself is not a referrer. */
export function getReferrerDomain(
  referrer: string | undefined,
  siteDomain: string,
): string | null {
  if (!referrer) return null;

  let hostname: string;
  try {
    hostname = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }

  if (hostname === siteDomain || hostname.endsWith(`.${siteDomain}`))
    return null;
  return hostname.slice(0, 253);
}
