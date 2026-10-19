export const DEFAULT_TIME_ZONE = "UTC";

export function isValidTimeZone(value: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

/** Calendar date ("YYYY-MM-DD") of an instant in a time zone. */
export function ymdInZone(instant: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(instant);
}

export function shiftYmd(ymd: string, days: number) {
  const date = new Date(`${ymd}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Whole days from `from` to `to` (both "YYYY-MM-DD"). */
export function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / (24 * 60 * 60 * 1000));
}

/** Offset of a time zone from UTC at an instant, in milliseconds (positive east of Greenwich). */
function offsetAt(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const localAsUtc = Date.UTC(value("year"), value("month") - 1, value("day"), value("hour"), value("minute"), value("second"));

  return localAsUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

/** The instant at which a calendar day starts in a time zone. */
export function zonedStartOfDay(ymd: string, timeZone: string) {
  const guess = Date.parse(`${ymd}T00:00:00Z`);
  const first = guess - offsetAt(new Date(guess), timeZone);
  // The offset can differ at `first` (daylight saving change): settle on the second pass.
  return new Date(guess - offsetAt(new Date(first), timeZone));
}
