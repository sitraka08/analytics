"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { useOverviewQuery } from "../hooks/use-analytics-queries";
import { DashboardNavigationProvider, useDashboardParams } from "../hooks/use-dashboard-params";
import { hasActiveFilters } from "../utils/search-params";
import { ActiveFilters } from "./active-filters";
import { RankingSection, RecentVisitsSection, VisitorsSection, WorldMapSection } from "./analytics-sections";
import { FilterBar } from "./filter-bar";
import { KpiGrid } from "./kpi-grid";
import { PeriodTabs } from "./period-tabs";
import { SectionError } from "./section-error";
import { SectionSkeleton } from "./section-skeleton";

// Below this many pageviews the numbers are too thin to read trends into.
const LOW_DATA_PAGEVIEWS = 20;

type SiteDashboardProps = {
  siteId: string;
  basePath: string;
  /** Title block of the page (server-rendered). */
  title: React.ReactNode;
  /** Shown instead of the stats while the site has not received any visit yet. */
  installSnippet: React.ReactNode;
  dangerZone: React.ReactNode;
};

function Dashboard({ siteId, basePath, title, installSnippet, dangerZone }: SiteDashboardProps) {
  const { period, filters } = useDashboardParams();
  const overview = useOverviewQuery(siteId, period, filters);
  const filtered = hasActiveFilters(filters);
  const data = overview.data;
  const hasData = data ? data.current.pageviews > 0 || data.previous.pageviews > 0 : false;

  return (
    <>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        {title}
        <div className="flex flex-wrap items-center gap-3">
          {hasData ? (
            <Link
              href={ROUTES.siteVisits(siteId)}
              className="inline-flex h-9 items-center gap-2 rounded-full border-[1.5px] border-foreground/15 bg-surface px-4 text-sm font-medium hover:border-foreground/35 hover:bg-cream-deep"
            >
              Toutes les visites
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          ) : null}
          <PeriodTabs current={period} basePath={basePath} filters={filters} />
        </div>
      </div>

      {!data ? (
        overview.isError ? (
          <div className="mt-5">
            <SectionError onRetry={() => overview.refetch()} />
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            <SectionSkeleton className="h-16 rounded-3xl" />
            <SectionSkeleton className="h-28 rounded-3xl" />
            <SectionSkeleton />
          </div>
        )
      ) : (
        <>
          {hasData || filtered ? (
            <div className="mt-4">
              <FilterBar siteId={siteId} period={period} filters={filters} basePath={basePath} />
            </div>
          ) : null}

          {filtered ? (
            <div className="mt-3">
              <ActiveFilters basePath={basePath} period={period} filters={filters} />
            </div>
          ) : null}

          {hasData ? (
            <div className={cn("mt-5 flex flex-col gap-3 transition-opacity", overview.isPlaceholderData && "opacity-60")} aria-busy={overview.isPlaceholderData}>
              {data.current.pageviews < LOW_DATA_PAGEVIEWS ? (
                <p className="rounded-2xl bg-cream-deep px-4 py-3 text-sm">
                  Encore peu de données : les tendances seront plus fiables avec davantage de visites.
                </p>
              ) : null}
              <KpiGrid overview={data} />
              <VisitorsSection siteId={siteId} />
              <div className="grid gap-3 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <WorldMapSection siteId={siteId} basePath={basePath} />
                </div>
                <div className="lg:col-span-2">
                  <RecentVisitsSection siteId={siteId} />
                </div>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {(["pages", "referrers", "cities", "devices"] as const).map((dimension) => (
                  <RankingSection key={dimension} siteId={siteId} basePath={basePath} dimension={dimension} />
                ))}
              </div>
            </div>
          ) : filtered ? (
            <p className="mt-5 max-w-xl rounded-2xl bg-cream-deep px-4 py-3 text-sm">
              Aucune visite ne correspond à ces filtres sur cette période. Retirez un filtre ou choisissez une période plus longue.
            </p>
          ) : (
            <div className="mt-5">{installSnippet}</div>
          )}
        </>
      )}

      {dangerZone}
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
