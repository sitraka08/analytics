import type { Period } from "../schemas/period";
import { daysBetween, shiftYmd, ymdInZone, zonedStartOfDay } from "./time-zone";

const HOUR_MS = 60 * 60 * 1000;

const ROLLING_HOURS = {
  "24h": 24,
  "7d": 7 * 24,
  "30d": 30 * 24,
  "90d": 90 * 24,
} as const;

export type PeriodRange = {
  from: Date;
  /** Exclusive end. */
  to: Date;
  previousFrom: Date;
  /** Buckets of the visitors curve: hourly up to two days, daily beyond. */
  unit: "hour" | "day";
  /** Time zone the buckets are computed in. */
  tz: string;
};

export function getPeriodRange(period: Period, now = new Date()): PeriodRange {
  if (period.preset === "today" || period.preset === "custom") {
    const { tz } = period;
    const firstDay = period.preset === "custom" ? period.from : ymdInZone(now, tz);
    const lastDay = period.preset === "custom" ? period.to : firstDay;
    const from = zonedStartOfDay(firstDay, tz);
    const to = new Date(Math.min(zonedStartOfDay(shiftYmd(lastDay, 1), tz).getTime(), now.getTime()));
    const length = to.getTime() - from.getTime();

    return { from, to, previousFrom: new Date(from.getTime() - length), unit: daysBetween(firstDay, lastDay) < 2 ? "hour" : "day", tz };
  }

  const length = ROLLING_HOURS[period.preset] * HOUR_MS;
  const from = new Date(now.getTime() - length);

  return { from, to: now, previousFrom: new Date(from.getTime() - length), unit: period.preset === "24h" ? "hour" : "day", tz: "UTC" };
}
