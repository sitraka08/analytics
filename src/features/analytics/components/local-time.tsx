"use client";

import { useSyncExternalStore } from "react";
import { formatClock, formatSessionTime } from "../utils/session-label";

const subscribe = () => () => {};
const browserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
// The server has no browser zone: it renders UTC, then hydration swaps in the viewer's zone.
const serverTimeZone = () => "UTC";

type LocalTimeProps = { iso: string; variant?: "short" | "long" | "clock" };

/** An instant shown in the viewer's own time zone. */
export function LocalTime({ iso, variant = "short" }: LocalTimeProps) {
  const timeZone = useSyncExternalStore(
    subscribe,
    browserTimeZone,
    serverTimeZone,
  );
  const text =
    variant === "clock"
      ? formatClock(iso, timeZone)
      : formatSessionTime(iso, timeZone, variant === "long");

  return (
    <time dateTime={iso} suppressHydrationWarning>
      {text}
    </time>
  );
}
