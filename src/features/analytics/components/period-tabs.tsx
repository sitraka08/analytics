import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Filters } from "../schemas/filters";
import { DEFAULT_PERIOD, PRESETS, type Period, type Preset } from "../schemas/period";
import { buildDashboardHref } from "../utils/search-params";
import { DateRangePicker, TodayButton } from "./date-range-picker";

const LABELS: Record<Exclude<Preset, "today">, string> = {
  "24h": "24 heures",
  "7d": "7 jours",
  "30d": "30 jours",
  "90d": "90 jours",
};

export function PeriodTabs({ current, basePath, filters }: { current: Period; basePath: string; filters: Filters }) {
  return (
    <nav aria-label="Période" className="flex flex-wrap gap-2">
      <TodayButton active={current.preset === "today"} basePath={basePath} filters={filters} />
      {PRESETS.filter((preset) => preset !== "today").map((preset) => {
        const active = preset === current.preset;

        return (
          <Link
            key={preset}
            href={buildDashboardHref(basePath, { preset, tz: DEFAULT_PERIOD.tz }, filters)}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center rounded-full border-[1.5px] px-4 text-sm font-medium transition-colors",
              active ? "border-foreground bg-foreground text-background" : "border-input bg-surface hover:bg-cream-deep",
            )}
          >
            {LABELS[preset as Exclude<Preset, "today">]}
          </Link>
        );
      })}
      <DateRangePicker current={current} basePath={basePath} filters={filters} />
    </nav>
  );
}
