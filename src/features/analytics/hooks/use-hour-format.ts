"use client";

import { useSyncExternalStore } from "react";

export type HourFormat = "24h" | "12h";

const STORAGE_KEY = "analytics-hour-format";
const listeners = new Set<() => void>();
// Keeps the choice working for the session when the browser blocks storage.
let memory: HourFormat | null = null;

function read(): HourFormat {
  if (memory) return memory;
  try {
    return localStorage.getItem(STORAGE_KEY) === "12h" ? "12h" : "24h";
  } catch {
    return "24h";
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Display preference for the hours of the charts (dashboard UI only, unrelated to tracking). */
export function useHourFormat() {
  const format = useSyncExternalStore(subscribe, read, () => "24h" as const);

  function setFormat(next: HourFormat) {
    memory = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable: the in-memory value is enough.
    }
    listeners.forEach((listener) => listener());
  }

  return [format, setFormat] as const;
}
