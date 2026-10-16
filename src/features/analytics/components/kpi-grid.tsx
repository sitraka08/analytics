import type { Overview } from "../types/analytics";
import { computeChange, formatDuration, formatInteger, formatPercent } from "../utils/format";
import { KpiCard } from "./kpi-card";

export function KpiGrid({ overview: { current, previous } }: { overview: Overview }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard tone="blue" label="Visiteurs" value={formatInteger(current.visitors)} change={computeChange(current.visitors, previous.visitors)} />
      <KpiCard tone="green" label="Pages vues" value={formatInteger(current.pageviews)} change={computeChange(current.pageviews, previous.pageviews)} />
      <KpiCard
        tone="orange"
        label="Durée moyenne d'une visite"
        value={current.avgDurationMs === null ? "—" : formatDuration(current.avgDurationMs)}
        change={computeChange(current.avgDurationMs, previous.avgDurationMs)}
      />
      <KpiCard
        tone="violet"
        label="Visites sans clic"
        value={current.bounceRate === null ? "—" : formatPercent(current.bounceRate)}
        change={computeChange(current.bounceRate, previous.bounceRate)}
        lowerIsBetter
      />
    </div>
  );
}
