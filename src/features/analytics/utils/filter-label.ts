import type { Filters } from "../schemas/filters";

const regionNames = new Intl.DisplayNames("fr", { type: "region" });

/** Country codes read as names ("FR" → "France"); other values are shown as they are. */
export function formatFilterValue(key: keyof Filters, value: string) {
  if (key !== "country") return value;

  try {
    return regionNames.of(value) ?? value;
  } catch {
    return value;
  }
}
