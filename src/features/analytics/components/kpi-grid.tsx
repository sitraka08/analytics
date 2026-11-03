import type { ChartMetric, Overview } from "../types/analytics";
import {
  computeChange,
  formatDuration,
  formatInteger,
  formatPercent,
} from "../utils/format";
import { KpiCard } from "./kpi-card";

type KpiGridProps = {
  overview: Overview;
  /** Metric drawn in the chart below; its card is the colored one. */
  metric: ChartMetric;
  onMetricChange: (metric: ChartMetric) => void;
};

export function KpiGrid({
  overview: { current, previous },
  metric,
  onMetricChange,
}: KpiGridProps) {
  return (
    <div
      role="group"
      aria-label="Chiffres clés"
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      <KpiCard
        tone="blue"
        label="Visiteurs"
        value={formatInteger(current.visitors)}
        change={computeChange(current.visitors, previous.visitors)}
        highlighted={metric === "visitors"}
        onSelect={() => onMetricChange("visitors")}
      />
      <KpiCard
        tone="green"
        label="Pages vues"
        value={formatInteger(current.pageviews)}
        change={computeChange(current.pageviews, previous.pageviews)}
        highlighted={metric === "pageviews"}
        onSelect={() => onMetricChange("pageviews")}
      />
      <KpiCard
        tone="orange"
        label="Durée moyenne d'une visite"
        value={
          current.avgDurationMs === null
            ? "—"
            : formatDuration(current.avgDurationMs)
        }
        change={computeChange(current.avgDurationMs, previous.avgDurationMs)}
      />
      <KpiCard
        tone="violet"
        label="Visites sans clic"
        value={
          current.bounceRate === null ? "—" : formatPercent(current.bounceRate)
        }
        change={computeChange(current.bounceRate, previous.bounceRate)}
        lowerIsBetter
      />
    </div>
  );
}
