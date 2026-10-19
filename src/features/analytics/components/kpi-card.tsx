import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { type Tone, toneClass } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { formatPercent } from "../utils/format";

type KpiCardProps = {
  label: string;
  value: string;
  /** Relative change vs the previous period, null when there is nothing to compare with. */
  change?: number | null;
  /** Replaces the change line for figures with no previous period to compare with. */
  note?: string;
  /** For bounce rate, a decrease is good news. */
  lowerIsBetter?: boolean;
  tone: Tone;
};

export function KpiCard({ label, value, change = null, note, lowerIsBetter = false, tone }: KpiCardProps) {
  return (
    <div className={cn("rounded-3xl p-4", toneClass(tone))}>
      <p className="text-sm text-tone-foreground/85">{label}</p>
      <p className="mt-1 truncate font-heading text-2xl font-bold tracking-tight tabular-nums">{value}</p>
      {note ? <p className="mt-1 text-xs text-tone-foreground/85">{note}</p> : <Change change={change} lowerIsBetter={lowerIsBetter} />}
    </div>
  );
}

function Change({ change, lowerIsBetter }: { change: number | null; lowerIsBetter: boolean }) {
  if (change === null) {
    return <p className="mt-1 text-xs text-tone-foreground/85">Pas de comparaison possible</p>;
  }

  const Icon = change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : Minus;
  const good = change === 0 ? null : change > 0 !== lowerIsBetter;
  const sign = change > 0 ? "+" : "";

  return (
    <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-medium">
      <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2 py-0.5">
        <Icon className="size-3.5" aria-hidden />
        <span className="tabular-nums">
          {sign}
          {formatPercent(change)}
        </span>
        {good === null ? null : <span className="sr-only">{good ? "(en amélioration)" : "(en baisse)"}</span>}
      </span>
      <span className="font-normal text-tone-foreground/85">vs période précédente</span>
    </p>
  );
}
