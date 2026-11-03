import { TONE_BG, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import { formatInteger, formatPercent } from "../utils/format";
import { DashboardLink } from "./dashboard-link";
import { Panel } from "./panel";

export type RankingRow = {
  label: string;
  visitors: number;
  /** Filters after clicking this row: it applies this value, or removes it when already active. */
  filters: Filters;
  active: boolean;
  /** Flag or icon shown before the label. */
  leading?: React.ReactNode;
};

type RankingListProps = {
  title: string;
  /** Header of the label column ("Page", "Source"…). */
  columnLabel: string;
  rows: RankingRow[];
  emptyMessage: string;
  tone: Tone;
  basePath: string;
  period: Period;
  /** Visitors over the period, for each row's share; omitted when unknown. */
  total?: number;
  busy?: boolean;
};

// Rows that fit in the card before it scrolls (max-h-72 at ~38px per row).
const VISIBLE_ROWS = 7;

/** Horizontal bars as a plain ordered list: it is its own text equivalent. */
export function RankingList({ title, columnLabel, rows, emptyMessage, tone, basePath, period, total, busy }: RankingListProps) {
  const max = Math.max(...rows.map((row) => row.visitors), 1);
  const showShare = total !== undefined && total > 0;

  return (
    <Panel
      busy={busy}
      title={
        <span className="flex items-center gap-2">
          <span aria-hidden className={cn("size-2.5 rounded-full", TONE_BG[tone])} />
          {title}
        </span>
      }
    >
      {rows.length === 0 ? (
        <p className="rounded-2xl bg-cream-deep px-4 py-3 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <>
          <div aria-hidden className="flex justify-between gap-4 px-3 pb-1.5 text-xs text-muted-foreground">
            <span>{columnLabel}</span>
            <span>Visiteurs</span>
          </div>
          {/* Long lists scroll inside the card; the scrollbar stays hidden and a fade at the bottom hints there is more. */}
          <div
            role="region"
            aria-label={title}
            tabIndex={0}
            className={cn(
              "max-h-72 overflow-y-auto overscroll-contain rounded-lg [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground [&::-webkit-scrollbar]:hidden",
              rows.length > VISIBLE_ROWS && "[mask-image:linear-gradient(to_bottom,black_calc(100%-1.5rem),transparent)]",
            )}
          >
            <ol className={cn("flex flex-col gap-1", rows.length > VISIBLE_ROWS && "pb-4")}>
              {rows.map((row) => (
                <li key={row.label}>
                  <DashboardLink
                    basePath={basePath}
                    period={period}
                    filters={row.filters}
                    aria-current={row.active ? "true" : undefined}
                    title={row.active ? "Retirer ce filtre" : "Filtrer sur cette valeur"}
                    className={cn(
                      "group relative flex items-center justify-between gap-4 rounded-xl border-b-[3px] border-transparent px-3 py-1.5 text-sm hover:bg-cream-deep/60",
                      row.active && "border-active-row-edge bg-active-row font-medium hover:bg-active-row",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn("absolute inset-y-0 left-0 rounded-xl opacity-20 transition-opacity group-hover:opacity-30", TONE_BG[tone], row.active && "opacity-0")}
                      style={{ width: `${(row.visitors / max) * 100}%` }}
                    />
                    <span className="relative flex min-w-0 items-center gap-2">
                      {row.leading ? (
                        <span aria-hidden className="flex w-5 shrink-0 items-center justify-center text-base leading-none">
                          {row.leading}
                        </span>
                      ) : null}
                      <span className="truncate">{row.label}</span>
                    </span>
                    <span className="relative flex shrink-0 items-baseline gap-2 font-mono tabular-nums">
                      {formatInteger(row.visitors)}
                      {showShare ? (
                        <span className="w-10 text-right text-xs text-muted-foreground">{formatPercent(Math.min(row.visitors / total, 1))}</span>
                      ) : null}
                    </span>
                  </DashboardLink>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </Panel>
  );
}
