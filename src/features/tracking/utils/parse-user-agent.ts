export type ParsedUserAgent = {
  device: "desktop" | "mobile" | "tablet";
  browser: string | null;
  os: string | null;
};

// Order matters: Edge and Opera also contain "Chrome", Chrome also contains "Safari", Android also contains "Linux".
const BROWSERS: [RegExp, string][] = [
  [/edg(e|a|ios)?\//i, "Edge"],
  [/opr\/|opera/i, "Opera"],
  [/samsungbrowser/i, "Samsung Internet"],
  [/firefox|fxios/i, "Firefox"],
  [/chrome|crios/i, "Chrome"],
  [/safari/i, "Safari"],
];

const SYSTEMS: [RegExp, string][] = [
  [/windows/i, "Windows"],
  [/iphone|ipad|ipod/i, "iOS"],
  [/android/i, "Android"],
  [/cros/i, "ChromeOS"],
  [/mac os x|macintosh/i, "macOS"],
  [/linux/i, "Linux"],
];

/** Coarse classification only; the raw user-agent is never stored. */
export function parseUserAgent(userAgent: string): ParsedUserAgent {
  const device = /ipad|tablet|android(?!.*mobile)/i.test(userAgent)
    ? "tablet"
    : /mobi|iphone|ipod|android/i.test(userAgent)
      ? "mobile"
      : "desktop";

  return {
    device,
    browser: BROWSERS.find(([pattern]) => pattern.test(userAgent))?.[1] ?? null,
    os: SYSTEMS.find(([pattern]) => pattern.test(userAgent))?.[1] ?? null,
  };
}
