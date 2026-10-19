"use client";

import { CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import { buildDashboardHref } from "../utils/search-params";

const pill = "inline-flex h-9 items-center gap-2 rounded-full border-[1.5px] px-4 text-sm font-medium transition-colors";
const pillActive = "border-foreground bg-foreground text-background";
const pillIdle = "border-input bg-surface hover:bg-cream-deep";

const browserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/** "YYYY-MM-DD" of a calendar day picked in the browser (local time). */
function toYmd(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function fromYmd(ymd: string) {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const shortDate = new Intl.DateTimeFormat("fr", { day: "numeric", month: "short" });
const longDate = new Intl.DateTimeFormat("fr", { day: "numeric", month: "short", year: "numeric" });

type ControlProps = { basePath: string; filters: Filters };

/** "Today" depends on the viewer's time zone, which only the browser knows. */
export function TodayButton({ active, basePath, filters }: ControlProps & { active: boolean }) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => router.push(buildDashboardHref(basePath, { preset: "today", tz: browserTimeZone() }, filters), { scroll: false })}
      className={cn(pill, active ? pillActive : pillIdle)}
    >
      Aujourd&apos;hui
    </button>
  );
}

export function DateRangePicker({ current, basePath, filters }: ControlProps & { current: Period }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(
    current.preset === "custom" ? { from: fromYmd(current.from), to: fromYmd(current.to) } : undefined,
  );
  const active = current.preset === "custom";

  const label =
    current.preset === "custom"
      ? current.from === current.to
        ? longDate.format(fromYmd(current.from))
        : `${shortDate.format(fromYmd(current.from))} – ${longDate.format(fromYmd(current.to))}`
      : "Personnalisé";

  function apply() {
    if (!range?.from) return;
    const from = toYmd(range.from);
    const to = toYmd(range.to ?? range.from);

    router.push(buildDashboardHref(basePath, { preset: "custom", from, to, tz: browserTimeZone() }, filters), { scroll: false });
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn(pill, active ? pillActive : pillIdle)} aria-label="Choisir une période personnalisée">
        <CalendarDays aria-hidden className="size-4" />
        {label}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto gap-3 rounded-2xl p-3">
        <Calendar
          mode="range"
          locale={fr}
          selected={range}
          onSelect={setRange}
          defaultMonth={range?.from ?? new Date()}
          numberOfMonths={2}
          disabled={{ after: new Date() }}
          weekStartsOn={1}
        />
        <div className="flex items-center justify-between gap-3 border-t pt-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {range?.from
              ? `${longDate.format(range.from)}${range.to && range.to.getTime() !== range.from.getTime() ? ` – ${longDate.format(range.to)}` : ""}`
              : "Choisissez un jour ou une plage de jours."}
          </p>
          <Button type="button" className="h-9 rounded-full px-4" disabled={!range?.from} onClick={apply}>
            Appliquer
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
