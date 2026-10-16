export const BUCKET_MS = { hour: 60 * 60 * 1000, day: 24 * 60 * 60 * 1000 } as const;

/** Every bucket start between `from` and `to`, in the same format as the SQL functions' `bucket` column. */
export function bucketDates(from: Date, to: Date, unit: keyof typeof BUCKET_MS): string[] {
  const step = BUCKET_MS[unit];
  const dates: string[] = [];

  for (let time = Math.floor(from.getTime() / step) * step; time < to.getTime(); time += step) {
    dates.push(new Date(time).toISOString().replace(/\.\d{3}Z$/, "Z"));
  }

  return dates;
}
