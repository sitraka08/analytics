import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { HeaderActions } from "@/components/layout/header-actions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DashboardSkeleton,
  PeriodTabs,
  SitesOverview,
  parsePeriod,
} from "@/features/analytics";
import { requireSession } from "@/features/auth";
import { SiteList, listSites } from "@/features/sites";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Vue d'ensemble" };

async function Overview({
  searchParams,
}: Pick<PageProps<"/dashboard">, "searchParams">) {
  const { user } = await requireSession();
  const query = await searchParams;
  const period = parsePeriod(query);
  const sites = await listSites(user.id);

  return (
    <div className="flex flex-col gap-6">
      {sites.length > 0 ? (
        <HeaderActions>
          <PeriodTabs
            current={period}
            basePath={ROUTES.dashboard}
            filters={{}}
          />
        </HeaderActions>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bonjour {user.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {sites.length > 0
              ? "Vue d'ensemble de tous vos sites."
              : "Bienvenue ! Commençons par votre premier site."}
          </p>
        </div>
        {sites.length > 0 ? (
          <Link
            href={ROUTES.newSite}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/85"
          >
            <Plus aria-hidden className="size-4" />
            Ajouter un site
          </Link>
        ) : null}
      </div>

      {sites.length > 0 ? (
        <Suspense fallback={<DashboardSkeleton />}>
          <SitesOverview userId={user.id} period={period} />
        </Suspense>
      ) : (
        <SiteList sites={sites} />
      )}
    </div>
  );
}

export default function DashboardPage({
  searchParams,
}: PageProps<"/dashboard">) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-16 w-72 rounded-2xl" />
            <DashboardSkeleton />
          </div>
        }
      >
        <Overview searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
