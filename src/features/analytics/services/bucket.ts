import { shiftYmd, ymdInZone, zonedStartOfDay } from "../utils/time-zone";

export const BUCKET_MS = { hour: 60 * 60 * 1000, day: 24 * 60 * 60 * 1000 } as const;

const toIso = (date: Date) => date.toISOString().replace(/\.\d{3}Z$/, "Z");

/**
 * Every bucket start between `from` and `to`, in the same format as the SQL functions' `bucket` column.
 * Daily buckets of a non-UTC `tz` start at that zone's midnight, like the SQL side.
 */
export function bucketDates(from: Date, to: Date, unit: keyof typeof BUCKET_MS, tz = "UTC"): string[] {
  const dates: string[] = [];

  if (unit === "day" && tz !== "UTC") {
    for (let day = ymdInZone(from, tz); ; day = shiftYmd(day, 1)) {
      const start = zonedStartOfDay(day, tz);
      if (start.getTime() >= to.getTime()) break;
      dates.push(toIso(start));
    }
    return dates;
  }

  const step = BUCKET_MS[unit];
  for (let time = Math.floor(from.getTime() / step) * step; time < to.getTime(); time += step) {
    dates.push(toIso(new Date(time)));
  }

  return dates;
}
