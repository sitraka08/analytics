import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BackLink } from "@/components/shared/back-link";
import {
  ActiveFilters,
  FilterBar,
  PeriodTabs,
  SectionSkeleton,
  SessionTable,
  filtersSchema,
  getSessions,
  pageNumberSchema,
  parsePeriod,
} from "@/features/analytics";
import { requireSession } from "@/features/auth";
import { SiteNotFoundError, getOwnedSite } from "@/features/sites";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Visites" };

async function VisitsContent({ params, searchParams }: Pick<PageProps<"/dashboard/sites/[siteId]/visits">, "params" | "searchParams">) {
  const { user } = await requireSession();
  const [{ siteId }, query] = await Promise.all([params, searchParams]);
  const first = (value: string | string[] | undefined) => (typeof value === "string" ? value : undefined);
  const period = parsePeriod(query);
  const filters = filtersSchema.parse({
    page: first(query.page),
    referrer: first(query.referrer),
    country: first(query.country),
    city: first(query.city),
    device: first(query.device),
  });
  const pageNumber = pageNumberSchema.parse(first(query.p));

  const site = await getOwnedSite(user.id, siteId).catch((error: unknown) => {
    if (error instanceof SiteNotFoundError) notFound();
    throw error;
  });
  const basePath = ROUTES.siteVisits(siteId);
  const scope = { userId: user.id, siteId, period, filters };
  const data = await getSessions(user.id, siteId, period, filters, pageNumber);

  return (
    <>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visites</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {site.name} · {site.domain}
          </p>
        </div>
        <PeriodTabs current={period} basePath={basePath} filters={filters} />
      </div>

      <div className="mt-6">
        <Suspense fallback={<SectionSkeleton className="h-16 rounded-3xl" />}>
          <FilterBar {...scope} basePath={basePath} />
        </Suspense>
      </div>
      <div className="mt-4">
        <ActiveFilters basePath={basePath} period={period} filters={filters} />
      </div>

      <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
        Une visite regroupe les pages vues d&apos;une même personne tant qu&apos;elle reste active. Les visiteurs sont anonymes : on ne peut pas
        les reconnaître d&apos;un jour à l&apos;autre.
      </p>
      <div className="mt-4">
        <SessionTable siteId={siteId} data={data} period={period} filters={filters} basePath={basePath} />
      </div>
    </>
  );
}

export default function VisitsPage({ params, searchParams }: PageProps<"/dashboard/sites/[siteId]/visits">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      {/* The back link needs the site id: resolved inside the Suspense boundary through the params promise. */}
      <Suspense fallback={<div className="mt-6 h-16 animate-pulse rounded-2xl bg-muted" />}>
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
