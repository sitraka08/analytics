import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { HeaderActions } from "@/components/layout/header-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterBar, PeriodTabs, SessionTable, getSessions, pageNumberSchema, parseDashboardQuery } from "@/features/analytics";
import { requireSession } from "@/features/auth";
import { SiteHeader, SiteHeaderSkeleton, SiteNotFoundError, getOwnedSite } from "@/features/sites";
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

  return (
    <>
      <HeaderActions>
        <PeriodTabs current={period} basePath={basePath} filters={filters} />
      </HeaderActions>
      <SiteHeader site={site} current="visits" />

      <div className="mt-6">
        <FilterBar siteId={siteId} period={period} filters={filters} basePath={basePath} />
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
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <Suspense
        fallback={
          <>
            <SiteHeaderSkeleton />
            <Skeleton className="mt-6 h-9 w-28 rounded-full" />
            <Skeleton className="mt-4 h-96 rounded-3xl" />
          </>
        }
      >
        <VisitsContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
