import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BackLink } from "@/components/shared/back-link";
import {
  ActiveFilters,
  FilterBar,
  KpiGrid,
  PeriodTabs,
  RankingSection,
  RecentVisitsSection,
  SectionSkeleton,
  VisitorsSection,
  WorldMapSection,
  filtersSchema,
  getOverview,
  hasActiveFilters,
  parsePeriod,
} from "@/features/analytics";
import { requireSession } from "@/features/auth";
import { DeleteSiteButton, SiteNotFoundError, getOwnedSite } from "@/features/sites";
import { InstallSnippet } from "@/features/tracking";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Statistiques" };

// Below this many pageviews the numbers are too thin to read trends into.
const LOW_DATA_PAGEVIEWS = 20;

async function SiteContent({ params, searchParams }: Pick<PageProps<"/dashboard/sites/[siteId]">, "params" | "searchParams">) {
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

  const site = await getOwnedSite(user.id, siteId).catch((error: unknown) => {
    if (error instanceof SiteNotFoundError) notFound();
    throw error;
  });
  const overview = await getOverview(user.id, siteId, period, filters);
  const hasData = overview.current.pageviews > 0 || overview.previous.pageviews > 0;
  const scope = { userId: user.id, siteId, period, filters };
  const basePath = ROUTES.site(siteId);
  const filtered = hasActiveFilters(filters);

  return (
    <>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{site.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{site.domain}</p>
        </div>
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

      {hasData || filtered ? (
        <div className="mt-4">
          <Suspense fallback={<SectionSkeleton className="h-16 rounded-3xl" />}>
            <FilterBar {...scope} basePath={basePath} />
          </Suspense>
        </div>
      ) : null}

      {filtered ? (
        <div className="mt-3">
          <ActiveFilters basePath={basePath} period={period} filters={filters} />
        </div>
      ) : null}

      {hasData ? (
        <div className="mt-5 flex flex-col gap-3">
          {overview.current.pageviews < LOW_DATA_PAGEVIEWS ? (
            <p className="rounded-2xl bg-cream-deep px-4 py-3 text-sm">
              Encore peu de données : les tendances seront plus fiables avec davantage de visites.
            </p>
          ) : null}
          <KpiGrid overview={overview} />
          <Suspense fallback={<SectionSkeleton />}>
            <VisitorsSection {...scope} />
          </Suspense>
          <div className="grid gap-3 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Suspense fallback={<SectionSkeleton className="h-80 rounded-3xl" />}>
                <WorldMapSection {...scope} basePath={basePath} />
              </Suspense>
            </div>
            <div className="lg:col-span-2">
              <Suspense fallback={<SectionSkeleton className="h-80 rounded-3xl" />}>
                <RecentVisitsSection {...scope} />
              </Suspense>
            </div>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {(["pages", "referrers", "cities", "devices"] as const).map((dimension) => (
              <Suspense key={dimension} fallback={<SectionSkeleton className="h-56 rounded-3xl" />}>
                <RankingSection {...scope} basePath={basePath} dimension={dimension} />
              </Suspense>
            ))}
          </div>
        </div>
      ) : filtered ? (
        <p className="mt-5 max-w-xl rounded-2xl bg-cream-deep px-4 py-3 text-sm">
          Aucune visite ne correspond à ces filtres sur cette période. Retirez un filtre ou choisissez une période plus longue.
        </p>
      ) : (
        <div className="mt-5">
          <InstallSnippet publicKey={site.publicKey} domain={site.domain} />
        </div>
      )}

      <section
        aria-labelledby="danger-zone"
        className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border-[1.5px] border-destructive/30 p-4"
      >
        <div className="max-w-md">
          <h2 id="danger-zone" className="text-base font-bold">
            Zone dangereuse
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Supprimer ce site efface définitivement toutes ses statistiques.</p>
        </div>
        <DeleteSiteButton siteId={site.id} name={site.name} domain={site.domain} />
      </section>
    </>
  );
}

export default function SitePage({ params, searchParams }: PageProps<"/dashboard/sites/[siteId]">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      <BackLink href={ROUTES.dashboard}>Retour aux sites</BackLink>
      <Suspense fallback={<div className="mt-4 h-16 animate-pulse rounded-2xl bg-muted" />}>
        <SiteContent params={params} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
