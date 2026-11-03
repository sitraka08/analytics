"use client";

import { Area, AreaChart } from "recharts";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import type { TimeseriesPoint } from "../types/analytics";

const config = {
  visitors: { label: "Visiteurs", color: "var(--chart-1)" },
} satisfies ChartConfig;

/** Decorative trend line: the figures are always printed next to it. */
export function Sparkline({ points }: { points: TimeseriesPoint[] }) {
  return (
    <ChartContainer config={config} className="h-14 w-full" aria-hidden>
      <AreaChart
        data={points}
        margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
      >
        <Area
          dataKey="visitors"
          type="monotone"
          stroke="var(--color-visitors)"
          fill="var(--color-visitors)"
          fillOpacity={0.2}
          strokeWidth={2}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
