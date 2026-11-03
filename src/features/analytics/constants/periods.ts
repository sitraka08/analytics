import type { Preset } from "../schemas/period";

/** Short labels for the segments, long ones for screen readers and the mobile select. */
export const PERIOD_LABELS: Record<Preset, { short: string; long: string }> = {
  today: { short: "Aujourd'hui", long: "Aujourd'hui" },
  "24h": { short: "24 h", long: "24 dernières heures" },
  "7d": { short: "7 j", long: "7 derniers jours" },
  "30d": { short: "30 j", long: "30 derniers jours" },
  "90d": { short: "90 j", long: "90 derniers jours" },
};
