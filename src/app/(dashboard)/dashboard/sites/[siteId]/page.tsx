import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BackLink } from "@/components/shared/back-link";
import { SiteDashboard, parseDashboardQuery, prefetchSiteDashboard } from "@/features/analytics";
import { requireSession } from "@/features/auth";
import { DeleteSiteButton, SiteNotFoundError, getOwnedSite } from "@/features/sites";
import { InstallSnippet } from "@/features/tracking";
import { getServerQueryClient } from "@/lib/query/get-server-query-client";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Statistiques" };

async function SiteContent({ params, searchParams }: Pick<PageProps<"/dashboard/sites/[siteId]">, "params" | "searchParams">) {
  const { user } = await requireSession();
  const [{ siteId }, query] = await Promise.all([params, searchParams]);
  const { period, filters } = parseDashboardQuery(query);

  const site = await getOwnedSite(user.id, siteId).catch((error: unknown) => {
    if (error instanceof SiteNotFoundError) notFound();
    throw error;
  });

  // Queries start now and stream to the client: the shell shows at once, widgets fill in as data arrives.
  const queryClient = getServerQueryClient();
  prefetchSiteDashboard(queryClient, user.id, siteId, period, filters);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SiteDashboard
        siteId={siteId}
        basePath={ROUTES.site(siteId)}
        title={
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{site.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{site.domain}</p>
          </div>
        }
        installSnippet={<InstallSnippet publicKey={site.publicKey} domain={site.domain} />}
        dangerZone={
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
        }
      />
    </HydrationBoundary>
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
