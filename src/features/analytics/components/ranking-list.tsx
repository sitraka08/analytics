import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatInteger } from "../utils/format";

export type RankingRow = {
  label: string;
  visitors: number;
  /** Link that applies this value as a filter, or removes it when already active. */
  href: string;
  active: boolean;
};

type RankingListProps = {
  title: string;
  rows: RankingRow[];
  emptyMessage: string;
};

/** Horizontal bars as a plain ordered list: it is its own text equivalent. */
export function RankingList({ title, rows, emptyMessage }: RankingListProps) {
  const max = Math.max(...rows.map((row) => row.visitors), 1);

  return (
    <section className="rounded-3xl bg-surface p-5">
      <h3 className="text-base font-bold">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ol className="mt-4 flex flex-col gap-1.5">
          {rows.map((row) => (
            <li key={row.label}>
              <Link
                href={row.href}
                scroll={false}
                aria-current={row.active ? "true" : undefined}
                title={row.active ? "Retirer ce filtre" : "Filtrer sur cette valeur"}
                className={cn(
                  "relative flex items-center justify-between gap-4 rounded-lg px-3 py-1.5 text-sm hover:bg-cream-deep/60",
                  row.active && "ring-2 ring-foreground",
                )}
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 rounded-lg bg-brand-blue/15"
                  style={{ width: `${(row.visitors / max) * 100}%` }}
                />
                <span className="relative min-w-0 truncate">{row.label}</span>
                <span className="relative font-mono tabular-nums">{formatInteger(row.visitors)}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
