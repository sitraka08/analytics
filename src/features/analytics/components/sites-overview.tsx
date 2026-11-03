import { Plus } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import type { Period } from "../schemas/period";
import { getSitesOverview } from "../services/sites-overview";
import { formatInteger } from "../utils/format";
import { KpiCard } from "./kpi-card";
import { Panel } from "./panel";
import { SiteCard } from "./site-card";
import { VisitorsChart } from "./visitors-chart";
import { getPeriodRange } from "../utils/period";

export async function SitesOverview({
  userId,
  period,
}: {
  userId: string;
  period: Period;
}) {
  const { sites, points } = await getSitesOverview(userId, period);
  const { unit } = getPeriodRange(period);
  const visitors = sites.reduce((sum, site) => sum + site.visitors, 0);
  const pageviews = sites.reduce((sum, site) => sum + site.pageviews, 0);
  const previousVisitors = sites.reduce(
    (sum, site) => sum + site.previousVisitors,
    0,
  );
  const activeSites = sites.filter((site) => site.visitors > 0).length;
  const topSite = sites.reduce<(typeof sites)[number] | null>(
    (top, site) => (site.visitors > (top?.visitors ?? 0) ? site : top),
    null,
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          highlighted
          tone="blue"
          label="Visiteurs, tous sites"
          value={formatInteger(visitors)}
          change={
            previousVisitors === 0
              ? null
              : (visitors - previousVisitors) / previousVisitors
          }
        />
        <KpiCard
          tone="green"
          label="Pages vues"
          value={formatInteger(pageviews)}
          note="Sur tous vos sites"
        />
        <KpiCard
          tone="orange"
          label="Sites avec des visites"
          value={`${activeSites} / ${sites.length}`}
          note="Sur la période choisie"
        />
        <KpiCard
          tone="violet"
          label="Site le plus visité"
          value={topSite?.name ?? "—"}
          note={
            topSite
              ? `${formatInteger(topSite.visitors)} visiteurs`
              : "Aucune visite"
          }
        />
      </div>

      <Panel
        title={`Visiteurs par ${unit === "hour" ? "heure" : "jour"}, tous sites`}
      >
        <VisitorsChart points={points} unit={unit} metric="visitors" />
      </Panel>

      <section className="mt-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold tracking-tight">Vos sites</h2>
          <Link
            href={ROUTES.newSite}
            className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
          >
            <Plus aria-hidden className="size-4" />
            Ajouter un site
          </Link>
        </div>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {sites.map((site) => (
            <li key={site.id}>
              <SiteCard site={site} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
