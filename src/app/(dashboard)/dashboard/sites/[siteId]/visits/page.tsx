import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BackLink } from "@/components/shared/back-link";
import {
  ActiveFilters,
  FilterBar,
  PeriodTabs,
  SessionTable,
  getSessions,
  pageNumberSchema,
  parseDashboardQuery,
  prefetchFilterOptions,
} from "@/features/analytics";
import { requireSession } from "@/features/auth";
import { SiteNotFoundError, getOwnedSite } from "@/features/sites";
import { getServerQueryClient } from "@/lib/query/get-server-query-client";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Visites" };

async function VisitsContent({ params, searchParams }: Pick<PageProps<"/dashboard/sites/[siteId]/visits">, "params" | "searchParams">) {
  const { user } = await requireSession();
  const [{ siteId }, query] = await Promise.all([params, searchParams]);
  const { period, filters } = parseDashboardQuery(query);
  const pageNumber = pageNumberSchema.parse(typeof query.p === "string" ? query.p : undefined);

  const site = await getOwnedSite(user.id, siteId).catch((error: unknown) => {
    if (error instanceof SiteNotFoundError) notFound();
    throw error;
  });
  const basePath = ROUTES.siteVisits(siteId);
  const data = await getSessions(user.id, siteId, period, filters, pageNumber);

  // The filter menus read their options through queries: start them now, they stream in.
  const queryClient = getServerQueryClient();
  prefetchFilterOptions(queryClient, user.id, siteId, period);

  return (
    <>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Visites</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {site.name} · {site.domain}
          </p>
        </div>
        <PeriodTabs current={period} basePath={basePath} filters={filters} />
      </div>

      <div className="mt-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <FilterBar siteId={siteId} period={period} filters={filters} basePath={basePath} />
        </HydrationBoundary>
      </div>
      <div className="mt-3 empty:hidden">
        <ActiveFilters basePath={basePath} period={period} filters={filters} />
      </div>

      <div className="mt-4">
        <SessionTable siteId={siteId} data={data} period={period} filters={filters} basePath={basePath} />
      </div>
      <p className="mt-3 max-w-2xl px-2 text-xs text-muted-foreground">
        Une visite regroupe les pages vues d&apos;une même personne tant qu&apos;elle reste active. Les visiteurs sont anonymes : on ne peut pas
        les reconnaître d&apos;un jour à l&apos;autre.
      </p>
    </>
  );
}

export default function VisitsPage({ params, searchParams }: PageProps<"/dashboard/sites/[siteId]/visits">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      {/* The back link needs the site id: resolved inside the Suspense boundary through the params promise. */}
      <Suspense fallback={<div className="mt-4 h-16 animate-pulse rounded-2xl bg-muted" />}>
        <VisitsBack params={params} />
        <VisitsContent params={params} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function VisitsBack({ params }: Pick<PageProps<"/dashboard/sites/[siteId]/visits">, "params">) {
  const { siteId } = await params;
  return <BackLink href={ROUTES.site(siteId)}>Retour aux statistiques</BackLink>;
}
