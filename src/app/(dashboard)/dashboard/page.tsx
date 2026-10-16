import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PeriodTabs, SectionSkeleton, SitesOverview, periodSchema } from "@/features/analytics";
import { requireSession } from "@/features/auth";
import { SiteList, listSites } from "@/features/sites";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Vue d'ensemble" };

async function Overview({ searchParams }: Pick<PageProps<"/dashboard">, "searchParams">) {
  const { user } = await requireSession();
  const query = await searchParams;
  const period = periodSchema.parse(typeof query.period === "string" ? query.period : undefined);
  const sites = await listSites(user.id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex w-full flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bonjour {user.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Vue d&apos;ensemble de tous vos sites.</p>
        </div>
        {sites.length > 0 ? (
          <div className="flex flex-wrap items-center gap-3">
            <PeriodTabs current={period} basePath={ROUTES.dashboard} filters={{}} />
            <Link
              href={ROUTES.newSite}
              className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85"
            >
              Ajouter un site
            </Link>
          </div>
        ) : null}
      </div>

      {sites.length > 0 ? (
        <Suspense fallback={<SectionSkeleton className="h-96 rounded-3xl" />}>
          <SitesOverview userId={user.id} period={period} />
        </Suspense>
      ) : (
        <SiteList sites={sites} />
      )}
    </div>
  );
}

export default function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-muted" />}>
        <Overview searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
