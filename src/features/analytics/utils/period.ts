import type { Period } from "../schemas/period";

const HOUR_MS = 60 * 60 * 1000;

const PERIOD_HOURS: Record<Period, number> = {
  "24h": 24,
  "7d": 7 * 24,
  "30d": 30 * 24,
  "90d": 90 * 24,
};

export type PeriodRange = {
  from: Date;
  to: Date;
  previousFrom: Date;
  /** Buckets of the visitors curve: hourly for a day, daily beyond. */
  unit: "hour" | "day";
};

export function getPeriodRange(period: Period, now = new Date()): PeriodRange {
  const length = PERIOD_HOURS[period] * HOUR_MS;
  const to = now;
  const from = new Date(to.getTime() - length);

  return { from, to, previousFrom: new Date(from.getTime() - length), unit: period === "24h" ? "hour" : "day" };
}
