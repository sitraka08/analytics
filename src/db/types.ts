// Mirrors supabase/migrations. Regenerate with `pnpm db:types` once the local stack is running.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type SiteRow = { id: string; user_id: string; name: string; domain: string; public_key: string; created_at: string };

type EventRow = {
  id: string;
  site_id: string;
  created_at: string;
  path: string;
  referrer_domain: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  country: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  visitor_hash: string;
  session_id: string;
  duration_ms: number | null;
};

type Filters = { p_page?: string | null; p_referrer?: string | null; p_country?: string | null; p_device?: string | null };

export type Database = {
  public: {
    Tables: {
      site: {
        Row: SiteRow;
        Insert: Omit<SiteRow, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<SiteRow>;
        Relationships: [];
      };
      event: {
        Row: EventRow;
        Insert: Omit<EventRow, "created_at" | "duration_ms"> & { created_at?: string; duration_ms?: number | null };
        Update: Partial<EventRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      analytics_totals: {
        Args: { p_site_id: string; p_from: string; p_to: string } & Filters;
        Returns: { visitors: number; sessions: number; pageviews: number; bounces: number; avg_duration_ms: number | null }[];
      };
      analytics_ranking: {
        Args: { p_site_id: string; p_dimension: string; p_from: string; p_to: string; p_limit?: number } & Filters;
        Returns: { label: string; visitors: number }[];
      };
      analytics_timeseries: {
        Args: { p_site_id: string; p_unit: string; p_from: string; p_to: string } & Filters;
        Returns: { bucket: string; visitors: number; pageviews: number }[];
      };
      analytics_sites_totals: {
        Args: { p_site_ids: string[]; p_previous_from: string; p_from: string; p_to: string };
        Returns: { site_id: string; visitors: number; pageviews: number; previous_visitors: number }[];
      };
      analytics_sites_series: {
        Args: { p_site_ids: string[]; p_unit: string; p_from: string; p_to: string };
        Returns: { site_id: string; bucket: string; visitors: number; pageviews: number }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
