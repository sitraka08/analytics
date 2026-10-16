import { Skeleton } from "@/components/ui/skeleton";
import { getRanking } from "../services/ranking";
import { getTimeseries } from "../services/timeseries";
import type { Period } from "../schemas/period";
import type { RankingDimension } from "../types/analytics";
import { getPeriodRange } from "../utils/period";
import { RankingList } from "./ranking-list";
import { VisitorsChart } from "./visitors-chart";

type SectionProps = { userId: string; siteId: string; period: Period };

export async function VisitorsSection({ userId, siteId, period }: SectionProps) {
  const points = await getTimeseries(userId, siteId, period);
  const { unit } = getPeriodRange(period);

  return (
    <section className="rounded-3xl bg-surface p-5">
      <h2 className="text-base font-bold">Visiteurs par {unit === "hour" ? "heure" : "jour"}</h2>
      <div className="mt-4">
        <VisitorsChart points={points} unit={unit} />
      </div>
    </section>
  );
}

const RANKINGS: Record<RankingDimension, { title: string; emptyMessage: string }> = {
  pages: { title: "Pages les plus vues", emptyMessage: "Aucune page vue sur cette période." },
  referrers: { title: "D'où viennent les visiteurs", emptyMessage: "Aucun site référent : les visites sont directes." },
  countries: { title: "Pays", emptyMessage: "Pays inconnu pour le moment." },
  devices: { title: "Appareils", emptyMessage: "Aucun appareil détecté." },
};

export async function RankingSection({ dimension, ...props }: SectionProps & { dimension: RankingDimension }) {
  const items = await getRanking(props.userId, props.siteId, props.period, dimension);
  return <RankingList items={items} {...RANKINGS[dimension]} />;
}

export function SectionSkeleton({ className }: { className?: string }) {
  return <Skeleton className={className ?? "h-64 rounded-3xl"} />;
}
