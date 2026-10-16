import type { RankingItem } from "../types/analytics";
import { formatInteger } from "../utils/format";

type RankingListProps = {
  title: string;
  items: RankingItem[];
  emptyMessage: string;
};

/** Horizontal bars as a plain ordered list: it is its own text equivalent. */
export function RankingList({ title, items, emptyMessage }: RankingListProps) {
  const max = Math.max(...items.map((item) => item.visitors), 1);

  return (
    <section className="rounded-3xl bg-surface p-5">
      <h3 className="text-base font-bold">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ol className="mt-4 flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.label} className="relative flex items-center justify-between gap-4 rounded-lg px-3 py-1.5 text-sm">
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 rounded-lg bg-brand-blue/15"
                style={{ width: `${(item.visitors / max) * 100}%` }}
              />
              <span className="relative min-w-0 truncate">{item.label}</span>
              <span className="relative font-mono tabular-nums">{formatInteger(item.visitors)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
