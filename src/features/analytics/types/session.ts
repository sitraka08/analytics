export type Place = {
  country: string | null;
  region: string | null;
  city: string | null;
};

export type Session = Place & {
  id: string;
  /** ISO instant of the visit's first page view. */
  startedAt: string;
  device: string | null;
  browser: string | null;
  os: string | null;
  referrerDomain: string | null;
  utmSource: string | null;
  entryPath: string;
  pageviews: number;
  durationMs: number | null;
};

export type SessionsPage = {
  sessions: Session[];
  total: number;
  page: number;
  pageSize: number;
};

export type SessionPageview = {
  /** ISO instant. */
  at: string;
  path: string;
  durationMs: number | null;
};

export type SessionDetail = Place & {
  id: string;
  startedAt: string;
  device: string | null;
  browser: string | null;
  os: string | null;
  referrerDomain: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  durationMs: number | null;
  pageviews: SessionPageview[];
};
