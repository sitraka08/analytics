import { ChartLine } from "lucide-react";
import { TONE_BG, type Tone, toneClass } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { ChangeBadge } from "./change-badge";

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
  /** Colored card: the metric drawn in the chart, or the page's headline figure. */
  highlighted?: boolean;
  /** Turns the card into a toggle that picks the chart's metric. */
  onSelect?: () => void;
};

export function KpiCard({
  label,
  value,
  change = null,
  note,
  lowerIsBetter = false,
  tone,
  highlighted = false,
  onSelect,
}: KpiCardProps) {
  const muted = highlighted
    ? "text-tone-foreground/85"
    : "text-muted-foreground";
  // Spans only: the card can be a <button>, which only accepts phrasing content.
  const body = (
    <>
      <span className="flex items-center gap-2 text-sm">
        <span
          aria-hidden
          className={cn(
            "size-2.5 shrink-0 rounded-full",
            highlighted ? "bg-tone-foreground" : TONE_BG[tone],
          )}
        />
        <span className={cn("min-w-0", muted)}>{label}</span>
        {onSelect ? (
          <ChartLine
            aria-hidden
            className={cn("ml-auto size-4 shrink-0", muted)}
          />
        ) : null}
      </span>
      <span className="mt-2 block truncate font-heading text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
        {value}
      </span>
      <span className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
        {note ? (
          <span className={muted}>{note}</span>
        ) : change === null ? (
          <span className={muted}>Pas de comparaison possible</span>
        ) : (
          <>
            <ChangeBadge
              change={change}
              lowerIsBetter={lowerIsBetter}
              onTone={highlighted}
            />
            <span className={muted}>vs période précédente</span>
          </>
        )}
      </span>
    </>
  );

  const className = cn(
    "flex h-full flex-col rounded-3xl border p-4 text-left sm:p-5",
    highlighted
      ? cn(toneClass(tone), "border-transparent")
      : "border-border/70 bg-surface",
  );

  if (!onSelect) return <div className={className}>{body}</div>;

  return (
    <button
      type="button"
      aria-pressed={highlighted}
      title={highlighted ? undefined : "Afficher dans le graphique"}
      onClick={onSelect}
      className={cn(
        className,
        "cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
        !highlighted && "hover:border-foreground/35",
      )}
    >
      {body}
    </button>
  );
}
