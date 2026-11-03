"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PERIOD_LABELS } from "../constants/periods";
import { useDashboardNavigate } from "../hooks/use-dashboard-params";
import type { Filters } from "../schemas/filters";
import {
  DEFAULT_PERIOD,
  PRESETS,
  type Period,
  type Preset,
} from "../schemas/period";
import { browserTimeZone } from "../utils/time-zone";

type PeriodSelectProps = {
  current: Period;
  basePath: string;
  filters: Filters;
  className?: string;
};

const ITEMS = [
  ...PRESETS.map((preset) => ({
    value: preset as string,
    label: PERIOD_LABELS[preset].long,
  })),
  { value: "custom", label: "Personnalisée" },
];

/** Narrow screens: the presets as one select instead of a row of segments. */
export function PeriodSelect({
  current,
  basePath,
  filters,
  className,
}: PeriodSelectProps) {
  const { go } = useDashboardNavigate(basePath);

  return (
    <Select
      items={ITEMS}
      value={current.preset}
      onValueChange={(value) => {
        if (!value || value === "custom") return;
        const preset = value as Preset;
        go(
          {
            preset,
            tz: preset === "today" ? browserTimeZone() : DEFAULT_PERIOD.tz,
          },
          filters,
        );
      }}
    >
      <SelectTrigger aria-label="Période" className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ITEMS.map((item) => (
          <SelectItem
            key={item.value}
            value={item.value}
            disabled={item.value === "custom"}
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
