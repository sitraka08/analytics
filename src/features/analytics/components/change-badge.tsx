import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPercent } from "../utils/format";

type ChangeBadgeProps = {
  /** Relative change vs the previous period. */
  change: number;
  /** For bounce rate, a decrease is good news. */
  lowerIsBetter?: boolean;
  /** On a colored card the badge stays white; elsewhere the arrow carries the good/bad color. */
  onTone?: boolean;
};

/** Arrow, sign and percentage: the trend never relies on color alone. */
export function ChangeBadge({ change, lowerIsBetter = false, onTone = false }: ChangeBadgeProps) {
  const Icon = change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : Minus;
  const good = change === 0 ? null : change > 0 !== lowerIsBetter;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        onTone ? "bg-black/20 text-tone-foreground" : "bg-cream-deep text-foreground",
      )}
    >
      <Icon
        aria-hidden
        className={cn("size-3.5", !onTone && good === true && "text-accent-green", !onTone && good === false && "text-destructive")}
      />
      <span className="tabular-nums">
        {change > 0 ? "+" : ""}
        {formatPercent(change)}
      </span>
      {good === null ? null : <span className="sr-only">{good ? "(en progrès)" : "(en recul)"}</span>}
    </span>
  );
}
