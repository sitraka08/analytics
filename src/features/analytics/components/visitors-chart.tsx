"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { TimeseriesPoint } from "../types/analytics";
import { formatCompact, formatInteger } from "../utils/format";

const config = {
  visitors: { label: "Visiteurs", color: "var(--chart-1)" },
} satisfies ChartConfig;

type VisitorsChartProps = {
  points: TimeseriesPoint[];
  unit: "hour" | "day";
};

export function VisitorsChart({ points, unit }: VisitorsChartProps) {
  const axisFormat = new Intl.DateTimeFormat("fr", unit === "hour" ? { hour: "2-digit", minute: "2-digit" } : { day: "numeric", month: "short" });
  const tooltipFormat = new Intl.DateTimeFormat("fr", unit === "hour" ? { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" } : { weekday: "long", day: "numeric", month: "long" });

  return (
    <>
      <ChartContainer config={config} className="h-64 w-full" aria-hidden>
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
          <Area dataKey="visitors" type="monotone" stroke="var(--color-visitors)" fill="var(--color-visitors)" fillOpacity={0.15} strokeWidth={2} />
        </AreaChart>
      </ChartContainer>
      <table className="sr-only">
        <caption>Visiteurs par {unit === "hour" ? "heure" : "jour"}</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Visiteurs</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.date}>
              <th scope="row">{tooltipFormat.format(new Date(point.date))}</th>
              <td>{formatInteger(point.visitors)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
