import { formatFilterValue } from "./filter-label";

/** "Ordinateur · Windows", or null when the device is unknown. */
export function formatSessionDevice(device: string | null, os: string | null) {
  return device ? formatFilterValue("device", `${device}:${os ?? ""}`) : null;
}

/** Campaign source first, then the referring site; empty means a direct visit. */
export function formatSessionSource(utmSource: string | null, referrerDomain: string | null) {
  return utmSource ?? referrerDomain ?? "Direct";
}

export function formatSessionTime(iso: string, timeZone: string, long = false) {
  return new Intl.DateTimeFormat("fr", {
    day: "numeric",
    month: long ? "long" : "short",
    year: long ? "numeric" : undefined,
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  }).format(new Date(iso));
}

const clock = (timeZone: string) => new Intl.DateTimeFormat("fr", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone });

export function formatClock(iso: string, timeZone: string) {
  return clock(timeZone).format(new Date(iso));
}
