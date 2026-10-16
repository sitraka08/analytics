/** Used only to compute the visitor hash and the rate-limit key; it is never stored or logged. */
export function getClientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
