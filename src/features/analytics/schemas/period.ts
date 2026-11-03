import { z } from "zod";
import {
  DEFAULT_TIME_ZONE,
  isValidTimeZone,
  shiftYmd,
  daysBetween,
  ymdInZone,
} from "../utils/time-zone";

export const PRESETS = ["today", "24h", "7d", "30d", "90d"] as const;

export const MAX_RANGE_DAYS = 366;

export type Preset = (typeof PRESETS)[number];

/** `tz` only matters for "today" and custom ranges; the rolling presets are time-zone independent. */
export type Period =
  | { preset: Preset; tz: string }
  | { preset: "custom"; from: string; to: string; tz: string };

export const DEFAULT_PERIOD: Period = { preset: "7d", tz: DEFAULT_TIME_ZONE };

const querySchema = z.object({
  period: z
    .enum([...PRESETS, "custom"])
    .optional()
    .catch(undefined),
  from: z.iso.date().optional().catch(undefined),
  to: z.iso.date().optional().catch(undefined),
  tz: z.string().max(64).refine(isValidTimeZone).optional().catch(undefined),
});

type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : undefined;

/** Invalid or missing URL values fall back to the default instead of failing the page. */
export function parsePeriod(query: SearchParams, now = new Date()): Period {
  const parsed = querySchema.parse({
    period: first(query.period),
    from: first(query.from),
    to: first(query.to),
    tz: first(query.tz),
  });
  const tz = parsed.tz ?? DEFAULT_TIME_ZONE;

  if (parsed.period === "custom" && parsed.from && parsed.to) {
    const today = ymdInZone(now, tz);
    const to = parsed.to > today ? today : parsed.to;
    let from = parsed.from > to ? to : parsed.from;
    if (daysBetween(from, to) + 1 > MAX_RANGE_DAYS)
      from = shiftYmd(to, -(MAX_RANGE_DAYS - 1));

    return { preset: "custom", from, to, tz };
  }

  if (parsed.period && parsed.period !== "custom") {
    return {
      preset: parsed.period,
      tz: parsed.period === "today" ? tz : DEFAULT_TIME_ZONE,
    };
  }

  return DEFAULT_PERIOD;
}
