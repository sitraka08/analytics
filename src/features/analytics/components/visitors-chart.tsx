"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useHourFormat, type HourFormat } from "../hooks/use-hour-format";
import type { TimeseriesPoint } from "../types/analytics";
import { formatCompact, formatInteger } from "../utils/format";

const config = {
  visitors: { label: "Visiteurs", color: "var(--chart-1)" },
  pageviews: { label: "Pages vues", color: "var(--chart-2)" },
} satisfies ChartConfig;

type VisitorsChartProps = {
  points: TimeseriesPoint[];
  unit: "hour" | "day";
};

const HOUR_FORMATS: { value: HourFormat; label: string }[] = [
  { value: "24h", label: "24 h" },
  { value: "12h", label: "AM/PM" },
];

export function VisitorsChart({ points, unit }: VisitorsChartProps) {
  const [hourFormat, setHourFormat] = useHourFormat();
  const hour12 = hourFormat === "12h";
  const hours = { hour: hour12 ? "numeric" : "2-digit", minute: "2-digit", hour12 } as const;
  const axisFormat = new Intl.DateTimeFormat("fr", unit === "hour" ? hours : { day: "numeric", month: "short" });
  const tooltipFormat = new Intl.DateTimeFormat("fr", unit === "hour" ? { day: "numeric", month: "long", ...hours } : { weekday: "long", day: "numeric", month: "long" });

  return (
    <>
      {unit === "hour" ? (
        <div role="group" aria-label="Format des heures" className="mb-3 flex w-fit rounded-full bg-cream-deep p-0.5 text-xs font-medium">
          {HOUR_FORMATS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={hourFormat === option.value}
              onClick={() => setHourFormat(option.value)}
              className={cn(
                "rounded-full px-3 py-1 transition-colors",
                hourFormat === option.value ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
      <ChartContainer config={config} className="h-52 w-full" aria-hidden>
        <AreaChart data={points} margin={{ left: 0, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            minTickGap={32}
            tickFormatter={(value: string) => axisFormat.format(new Date(value))}
          />
          <YAxis tickLine={false} axisLine={false} width={40} allowDecimals={false} tickFormatter={(value: number) => formatCompact(value)} />
          <ChartTooltip
            content={<ChartTooltipContent labelFormatter={(value: React.ReactNode) => tooltipFormat.format(new Date(String(value)))} indicator="line" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Area dataKey="pageviews" type="monotone" stroke="var(--color-pageviews)" fill="var(--color-pageviews)" fillOpacity={0.15} strokeWidth={2} />
          <Area dataKey="visitors" type="monotone" stroke="var(--color-visitors)" fill="var(--color-visitors)" fillOpacity={0.2} strokeWidth={2} />
        </AreaChart>
      </ChartContainer>
      <table className="sr-only">
        <caption>Visiteurs par {unit === "hour" ? "heure" : "jour"}</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Visiteurs</th>
            <th scope="col">Pages vues</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.date}>
              <th scope="row">{tooltipFormat.format(new Date(point.date))}</th>
              <td>{formatInteger(point.visitors)}</td>
              <td>{formatInteger(point.pageviews)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
