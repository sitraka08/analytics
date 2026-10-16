export type Totals = {
  visitors: number;
  pageviews: number;
  avgDurationMs: number | null;
  /** Share of single-page sessions, between 0 and 1. */
  bounceRate: number | null;
};

export type Overview = {
  current: Totals;
  previous: Totals;
};

export type TimeseriesPoint = {
  /** ISO instant of the bucket start (UTC). */
  date: string;
  visitors: number;
  pageviews: number;
};

export type SiteOverview = {
  id: string;
  name: string;
  domain: string;
  visitors: number;
  pageviews: number;
  previousVisitors: number;
  points: TimeseriesPoint[];
};

export type SitesOverview = {
  sites: SiteOverview[];
  /** Sum of every site's curve. */
  points: TimeseriesPoint[];
};

export type RankingItem = {
  label: string;
  visitors: number;
};

export type RankingDimension = "pages" | "referrers" | "countries" | "devices";
