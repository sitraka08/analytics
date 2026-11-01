import { TONE_BG, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import { formatInteger } from "../utils/format";
import { DashboardLink } from "./dashboard-link";

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
  rows: RankingRow[];
  emptyMessage: string;
  tone: Tone;
  basePath: string;
  period: Period;
};

/** Horizontal bars as a plain ordered list: it is its own text equivalent. */
export function RankingList({ title, rows, emptyMessage, tone, basePath, period }: RankingListProps) {
  const max = Math.max(...rows.map((row) => row.visitors), 1);

  return (
    <section className="rounded-3xl bg-surface p-4">
      <h3 className="flex items-center gap-2 text-base font-bold">
        <span aria-hidden className={cn("size-3 rounded-full", TONE_BG[tone])} />
        {title}
        {rows.length > 0 ? <span className="ml-auto text-xs font-normal text-muted-foreground tabular-nums">{formatInteger(rows.length)}</span> : null}
      </h3>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        // Long lists scroll inside the card; the scrollbar stays hidden and a fade at the bottom hints there is more.
        <div
          role="region"
          aria-label={title}
          tabIndex={0}
          className="mt-3 max-h-56 overflow-y-auto overscroll-contain rounded-lg [mask-image:linear-gradient(to_bottom,black_calc(100%-1.5rem),transparent)] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground [&::-webkit-scrollbar]:hidden"
        >
          <ol className="flex flex-col gap-1.5 pb-4">
            {rows.map((row) => (
              <li key={row.label}>
                <DashboardLink
                  basePath={basePath}
                  period={period}
                  filters={row.filters}
                  aria-current={row.active ? "true" : undefined}
                  title={row.active ? "Retirer ce filtre" : "Filtrer sur cette valeur"}
                  className={cn(
                    "relative flex items-center justify-between gap-4 rounded-xl border-b-[3px] border-transparent px-3 py-1.5 text-sm hover:bg-cream-deep/60",
                    row.active && "border-active-row-edge bg-active-row font-medium hover:bg-active-row",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn("absolute inset-y-0 left-0 rounded-xl opacity-25", TONE_BG[tone], row.active && "opacity-0")}
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
                  <span className="relative font-mono tabular-nums">{formatInteger(row.visitors)}</span>
                </DashboardLink>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
