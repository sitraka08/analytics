import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPercent } from "../utils/format";

type KpiCardProps = {
  label: string;
  value: string;
  /** Relative change vs the previous period, null when there is nothing to compare with. */
  change: number | null;
  /** For bounce rate, a decrease is good news. */
  lowerIsBetter?: boolean;
};

export function KpiCard({ label, value, change, lowerIsBetter = false }: KpiCardProps) {
  return (
    <div className="rounded-3xl bg-surface p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-heading text-3xl font-bold tracking-tight tabular-nums">{value}</p>
      <Change change={change} lowerIsBetter={lowerIsBetter} />
    </div>
  );
}

function Change({ change, lowerIsBetter }: { change: number | null; lowerIsBetter: boolean }) {
  if (change === null) {
    return <p className="mt-2 text-xs text-muted-foreground">Pas de comparaison possible</p>;
  }

  const Icon = change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : Minus;
  const good = change === 0 ? null : change > 0 !== lowerIsBetter;
  const sign = change > 0 ? "+" : "";

  return (
    <p
      className={cn(
        "mt-2 inline-flex items-center gap-1 text-xs font-medium",
        good === null ? "text-muted-foreground" : good ? "text-accent-green" : "text-destructive",
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      <span className="tabular-nums">
        {sign}
        {formatPercent(change)}
      </span>
      <span className="font-normal text-muted-foreground">vs période précédente</span>
    </p>
  );
}
