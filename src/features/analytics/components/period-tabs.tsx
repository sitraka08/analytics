import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Filters } from "../schemas/filters";
import { PERIODS, type Period } from "../schemas/period";
import { buildDashboardHref } from "../utils/search-params";

const LABELS: Record<Period, string> = {
  "24h": "24 heures",
  "7d": "7 jours",
  "30d": "30 jours",
  "90d": "90 jours",
};

export function PeriodTabs({ current, basePath, filters }: { current: Period; basePath: string; filters: Filters }) {
  return (
    <nav aria-label="Période" className="flex flex-wrap gap-2">
      {PERIODS.map((period) => (
        <Link
          key={period}
          href={buildDashboardHref(basePath, period, filters)}
          scroll={false}
          aria-current={period === current ? "page" : undefined}
          className={cn(
            "inline-flex h-9 items-center rounded-full border-[1.5px] px-4 text-sm font-medium transition-colors",
            period === current
              ? "border-foreground bg-foreground text-background"
              : "border-input bg-surface hover:bg-cream-deep",
          )}
        >
          {LABELS[period]}
        </Link>
      ))}
    </nav>
  );
}
