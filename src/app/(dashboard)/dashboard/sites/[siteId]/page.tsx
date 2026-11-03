import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DashboardSkeleton, SiteDashboard, parseDashboardQuery, prefetchSiteDashboard } from "@/features/analytics";
import { requireSession } from "@/features/auth";
import { SiteHeader, SiteHeaderSkeleton, SiteNotFoundError, getOwnedSite } from "@/features/sites";
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
    <>
      <SiteHeader site={site} current="stats" />
      <div className="mt-6">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SiteDashboard
            siteId={siteId}
            basePath={ROUTES.site(siteId)}
            installSnippet={<InstallSnippet publicKey={site.publicKey} domain={site.domain} />}
          />
        </HydrationBoundary>
      </div>
    </>
  );
}

export default function SitePage({ params, searchParams }: PageProps<"/dashboard/sites/[siteId]">) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <Suspense
        fallback={
          <>
            <SiteHeaderSkeleton />
            <div className="mt-6">
              <DashboardSkeleton />
            </div>
          </>
        }
      >
        <SiteContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
