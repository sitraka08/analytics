import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { KpiGrid, PeriodTabs, RankingSection, SectionSkeleton, VisitorsSection, getOverview, periodSchema } from "@/features/analytics";
import { requireSession } from "@/features/auth";
import { SiteNotFoundError, getOwnedSite } from "@/features/sites";
import { InstallSnippet } from "@/features/tracking";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Statistiques" };

// Below this many pageviews the numbers are too thin to read trends into.
const LOW_DATA_PAGEVIEWS = 20;

async function SiteContent({ params, searchParams }: Pick<PageProps<"/dashboard/sites/[siteId]">, "params" | "searchParams">) {
  const { user } = await requireSession();
  const [{ siteId }, query] = await Promise.all([params, searchParams]);
  const period = periodSchema.parse(typeof query.period === "string" ? query.period : undefined);

  const site = await getOwnedSite(user.id, siteId).catch((error: unknown) => {
    if (error instanceof SiteNotFoundError) notFound();
    throw error;
  });
  const overview = await getOverview(user.id, siteId, period);
  const hasData = overview.current.pageviews > 0 || overview.previous.pageviews > 0;
  const scope = { userId: user.id, siteId, period };

  return (
    <>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{site.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{site.domain}</p>
        </div>
        <PeriodTabs current={period} basePath={ROUTES.site(siteId)} />
      </div>

      {hasData ? (
        <div className="mt-8 flex flex-col gap-4">
          {overview.current.pageviews < LOW_DATA_PAGEVIEWS ? (
            <p className="rounded-2xl bg-cream-deep px-4 py-3 text-sm">
              Encore peu de données : les tendances seront plus fiables avec davantage de visites.
            </p>
          ) : null}
          <KpiGrid overview={overview} />
          <Suspense fallback={<SectionSkeleton />}>
            <VisitorsSection {...scope} />
          </Suspense>
          <div className="grid gap-4 lg:grid-cols-2">
            {(["pages", "referrers", "countries", "devices"] as const).map((dimension) => (
              <Suspense key={dimension} fallback={<SectionSkeleton className="h-56 rounded-3xl" />}>
                <RankingSection {...scope} dimension={dimension} />
              </Suspense>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <p className="mb-4 max-w-xl text-sm text-muted-foreground">
            Aucune visite enregistrée pour l&apos;instant. Installez le script sur votre site, les premières statistiques
            apparaîtront dès la première page vue.
          </p>
          <InstallSnippet publicKey={site.publicKey} />
        </div>
      )}
    </>
  );
}

export default function SitePage({ params, searchParams }: PageProps<"/dashboard/sites/[siteId]">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <Link href={ROUTES.dashboard} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
        ← Retour aux sites
      </Link>
      <Suspense fallback={<div className="mt-6 h-16 animate-pulse rounded-2xl bg-muted" />}>
        <SiteContent params={params} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
