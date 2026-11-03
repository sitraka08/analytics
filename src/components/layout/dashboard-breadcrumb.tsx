"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href: string };

function getCrumbs(
  pathname: string,
  sites: { id: string; name: string }[],
): Crumb[] {
  const root = { label: "Vue d'ensemble", href: ROUTES.dashboard };
  if (pathname === ROUTES.newSite)
    return [root, { label: "Ajouter un site", href: ROUTES.newSite }];
  if (pathname === ROUTES.settings)
    return [root, { label: "Paramètres du compte", href: ROUTES.settings }];

  const site = sites.find(
    (item) =>
      pathname === ROUTES.site(item.id) ||
      pathname.startsWith(`${ROUTES.site(item.id)}/`),
  );
  if (!site) return [root];

  const siteCrumb = { label: site.name, href: ROUTES.site(site.id) };
  const visits = { label: "Visites", href: ROUTES.siteVisits(site.id) };
  if (pathname === ROUTES.siteSettings(site.id))
    return [root, siteCrumb, { label: "Paramètres", href: pathname }];
  if (pathname === visits.href) return [root, siteCrumb, visits];
  if (pathname.startsWith(`${visits.href}/`))
    return [root, siteCrumb, visits, { label: "Détail", href: pathname }];
  return [root, siteCrumb];
}

/** Below `sm` only the current page shows: the sidebar is a sheet there and the header is narrow. */
export function DashboardBreadcrumb({
  sites,
}: {
  sites: { id: string; name: string }[];
}) {
  const crumbs = getCrumbs(usePathname(), sites);

  return (
    <nav aria-label="Fil d'Ariane" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5 text-sm">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;

          return (
            <li
              key={crumb.href}
              className={cn(
                "min-w-0 items-center gap-1.5",
                last ? "flex" : "hidden sm:flex",
              )}
            >
              {index > 0 ? (
                <ChevronRight
                  aria-hidden
                  className="hidden size-3.5 shrink-0 text-muted-foreground sm:block"
                />
              ) : null}
              {last ? (
                <span aria-current="page" className="truncate font-medium">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="truncate text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
