import type { Filters } from "../schemas/filters";

const regionNames = new Intl.DisplayNames("fr", { type: "region" });

const DEVICE_LABELS: Record<string, string> = { desktop: "Ordinateur", mobile: "Mobile", tablet: "Tablette" };

/** Device values are "<type>:<os>" ("desktop:Windows"); the OS part can be empty. */
export function parseDevice(value: string) {
  const [type, os] = value.split(":");
  return { type, os: os || null };
}

/** Raw values read as labels: "FR" → "France", "desktop:Windows" → "Ordinateur · Windows"; other values are shown as they are. */
export function formatFilterValue(key: keyof Filters, value: string) {
  if (key === "device") {
    const { type, os } = parseDevice(value);
    const label = DEVICE_LABELS[type] ?? type;
    return os ? `${label} · ${os}` : label;
  }

  if (key !== "country") return value;

  try {
    return regionNames.of(value) ?? value;
  } catch {
    return value;
  }
}
