import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import type { SiteOverview } from "../types/analytics";
import { computeChange, formatInteger } from "../utils/format";
import { ChangeBadge } from "./change-badge";
import { Sparkline } from "./sparkline";

export function SiteCard({ site }: { site: SiteOverview }) {
  const change = computeChange(site.visitors, site.previousVisitors);
  const hasData = site.visitors > 0 || site.previousVisitors > 0;

  return (
    <Link
      href={ROUTES.site(site.id)}
      className="flex h-full flex-col gap-4 rounded-3xl border border-border/70 bg-surface p-5 transition-colors hover:border-foreground/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
    >
      <span className="min-w-0">
        <span className="block truncate font-heading font-bold">
          {site.name}
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          {site.domain}
        </span>
      </span>

      {hasData ? (
        <>
          <span className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold tabular-nums">
              {formatInteger(site.visitors)}
            </span>
            <span className="text-sm text-muted-foreground">visiteurs</span>
            {change === null ? null : (
              <span className="ml-auto">
                <ChangeBadge change={change} />
              </span>
            )}
          </span>
          <Sparkline points={site.points} />
        </>
      ) : (
        <span className="rounded-2xl bg-cream-deep px-4 py-3 text-sm text-muted-foreground">
          Pas encore de visite. Ouvrez le site pour installer le script.
        </span>
      )}
    </Link>
  );
}
