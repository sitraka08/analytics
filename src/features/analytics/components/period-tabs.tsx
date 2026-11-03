import { cn } from "@/lib/utils";
import { PERIOD_LABELS } from "../constants/periods";
import type { Filters } from "../schemas/filters";
import { DEFAULT_PERIOD, PRESETS, type Period } from "../schemas/period";
import { DashboardLink } from "./dashboard-link";
import { DateRangePicker, TodayButton } from "./date-range-picker";
import { PeriodSelect } from "./period-select";

const segment = (active: boolean) =>
  cn(
    "inline-flex h-8 items-center rounded-full px-3 text-sm font-medium whitespace-nowrap transition-colors",
    active
      ? "bg-foreground text-background shadow-sm"
      : "text-muted-foreground hover:text-foreground",
  );

export function PeriodTabs({
  current,
  basePath,
  filters,
}: {
  current: Period;
  basePath: string;
  filters: Filters;
}) {
  return (
    <div className="flex items-center gap-2">
      <PeriodSelect
        current={current}
        basePath={basePath}
        filters={filters}
        className="h-10 rounded-full bg-surface px-3 lg:hidden"
      />
      <nav
        aria-label="Période"
        className="hidden items-center rounded-full bg-cream-deep p-1 lg:flex"
      >
        <TodayButton
          active={current.preset === "today"}
          basePath={basePath}
          filters={filters}
          className={segment(current.preset === "today")}
        />
        {PRESETS.filter((preset) => preset !== "today").map((preset) => {
          const active = preset === current.preset;

          return (
            <DashboardLink
              key={preset}
              basePath={basePath}
              period={{ preset, tz: DEFAULT_PERIOD.tz }}
              filters={filters}
              aria-current={active ? "page" : undefined}
              aria-label={PERIOD_LABELS[preset].long}
              className={segment(active)}
            >
              {PERIOD_LABELS[preset].short}
            </DashboardLink>
          );
        })}
      </nav>
      <DateRangePicker
        current={current}
        basePath={basePath}
        filters={filters}
      />
    </div>
  );
}
