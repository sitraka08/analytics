"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import { HeaderActions } from "@/components/layout/header-actions";
import { useOverviewQuery } from "../hooks/use-analytics-queries";
import {
  DashboardNavigationProvider,
  useDashboardParams,
} from "../hooks/use-dashboard-params";
import type { ChartMetric } from "../types/analytics";
import { hasActiveFilters } from "../utils/search-params";
import {
  RankingSection,
  RecentVisitsSection,
  VisitorsSection,
  WorldMapSection,
} from "./analytics-sections";
import { FilterBar } from "./filter-bar";
import { KpiGrid } from "./kpi-grid";
import { PeriodTabs } from "./period-tabs";
import { SectionError } from "./section-error";
import { DashboardSkeleton } from "./section-skeleton";

// Below this many pageviews the numbers are too thin to read trends into.
const LOW_DATA_PAGEVIEWS = 20;

type SiteDashboardProps = {
  siteId: string;
  basePath: string;
  /** Shown instead of the stats while the site has not received any visit yet. */
  installSnippet: React.ReactNode;
};

function Dashboard({ siteId, basePath, installSnippet }: SiteDashboardProps) {
  const { period, filters } = useDashboardParams();
  const overview = useOverviewQuery(siteId, period, filters);
  const [metric, setMetric] = useState<ChartMetric>("visitors");
  const filtered = hasActiveFilters(filters);
  const data = overview.data;
  const hasData = data
    ? data.current.pageviews > 0 || data.previous.pageviews > 0
    : false;

  return (
    <>
      <HeaderActions>
        <PeriodTabs current={period} basePath={basePath} filters={filters} />
      </HeaderActions>

      {!data ? (
        overview.isError ? (
          <SectionError onRetry={() => overview.refetch()} />
        ) : (
          <DashboardSkeleton />
        )
      ) : (
        <div className="flex flex-col gap-4">
          {hasData || filtered ? (
            <FilterBar
              siteId={siteId}
              period={period}
              filters={filters}
              basePath={basePath}
            />
          ) : null}

          {hasData ? (
            <div className="flex flex-col gap-3">
              {data.current.pageviews < LOW_DATA_PAGEVIEWS ? (
                <p className="flex items-center gap-2 rounded-2xl bg-cream-deep px-4 py-3 text-sm">
                  <Info aria-hidden className="size-4 shrink-0" />
                  Encore peu de données : les tendances seront plus fiables avec
                  davantage de visites.
                </p>
              ) : null}
              <div
                aria-busy={overview.isPlaceholderData || undefined}
                className={
                  overview.isPlaceholderData
                    ? "opacity-60 transition-opacity"
                    : "transition-opacity"
                }
              >
                <KpiGrid
                  overview={data}
                  metric={metric}
                  onMetricChange={setMetric}
                />
              </div>
              <VisitorsSection siteId={siteId} metric={metric} />
              <div className="grid gap-3 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <WorldMapSection siteId={siteId} basePath={basePath} />
                </div>
                <div className="lg:col-span-2">
                  <RecentVisitsSection siteId={siteId} />
                </div>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {(["pages", "referrers", "cities", "devices"] as const).map(
                  (dimension) => (
                    <RankingSection
                      key={dimension}
                      siteId={siteId}
                      basePath={basePath}
                      dimension={dimension}
                      total={data.current.visitors}
                    />
                  ),
                )}
              </div>
            </div>
          ) : filtered ? (
            <p className="max-w-xl rounded-2xl bg-cream-deep px-4 py-3 text-sm">
              Aucune visite ne correspond à ces filtres sur cette période.
              Retirez un filtre ou choisissez une période plus longue.
            </p>
          ) : (
            installSnippet
          )}
        </div>
      )}
    </>
  );
}

/** Stats of one site. Period and filters live in the URL; changing them refetches only what depends on them. */
export function SiteDashboard(props: SiteDashboardProps) {
  return (
    <DashboardNavigationProvider>
      <Dashboard {...props} />
    </DashboardNavigationProvider>
  );
}
