import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

export type SiteSection = "stats" | "visits" | "settings";

const TABS: { id: SiteSection; label: string; href: (siteId: string) => string }[] = [
  { id: "stats", label: "Statistiques", href: ROUTES.site },
  { id: "visits", label: "Visites", href: ROUTES.siteVisits },
  { id: "settings", label: "Paramètres", href: ROUTES.siteSettings },
];

type SiteHeaderProps = { site: { id: string; name: string; domain: string }; current: SiteSection };

/** Site title and its section tabs, shared by every page of a site. */
export function SiteHeader({ site, current }: SiteHeaderProps) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-2xl bg-foreground font-heading text-lg font-bold text-background">
          {site.name.trim()[0]?.toUpperCase() ?? "?"}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight">{site.name}</h1>
          <a
            href={`https://${site.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-full items-center gap-0.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <span className="truncate">{site.domain}</span>
            <ArrowUpRight aria-hidden className="size-3.5 shrink-0" />
            <span className="sr-only">(nouvel onglet)</span>
          </a>
        </div>
      </div>
      <nav aria-label="Sections du site" className="mt-5 border-b border-border">
        <ul className="-mb-px flex gap-6 overflow-x-auto">
          {TABS.map((tab) => {
            const active = tab.id === current;

            return (
              <li key={tab.id}>
                <Link
                  href={tab.href(site.id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 items-center border-b-2 text-sm font-medium whitespace-nowrap transition-colors",
                    active ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function SiteHeaderSkeleton() {
  return (
    <div aria-busy>
      <div className="flex items-center gap-3">
        <Skeleton className="size-11 rounded-2xl" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-32 rounded-lg" />
        </div>
      </div>
      <Skeleton className="mt-5 h-10 w-72 rounded-lg" />
    </div>
  );
}
