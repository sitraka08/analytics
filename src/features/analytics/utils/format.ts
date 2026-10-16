const compact = new Intl.NumberFormat("fr", { notation: "compact", maximumFractionDigits: 1 });
const integer = new Intl.NumberFormat("fr");
const percent = new Intl.NumberFormat("fr", { style: "percent", maximumFractionDigits: 0 });

export function formatCompact(value: number) {
  return compact.format(value);
}

export function formatInteger(value: number) {
  return integer.format(value);
}

export function formatPercent(ratio: number) {
  return percent.format(ratio);
}

/** "1 min 05 s", "42 s". */
export function formatDuration(ms: number) {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return minutes > 0 ? `${minutes} min ${String(seconds).padStart(2, "0")} s` : `${seconds} s`;
}

/** Relative change vs the previous period; null when there is nothing to compare with. */
export function computeChange(current: number | null, previous: number | null) {
  if (current === null || previous === null || previous === 0) return null;
  return (current - previous) / previous;
}
