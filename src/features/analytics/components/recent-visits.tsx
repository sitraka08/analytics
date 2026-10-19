import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import type { Session } from "../types/session";
import { formatPlace, placeFlag } from "../utils/place";
import { formatSessionDevice, formatSessionSource } from "../utils/session-label";
import { LocalTime } from "./local-time";

type RecentVisitsProps = { siteId: string; sessions: Session[] };

export function RecentVisits({ siteId, sessions }: RecentVisitsProps) {
  return (
    <section aria-labelledby="recent-visits-title" className="rounded-3xl bg-surface p-4">
      <h2 id="recent-visits-title" className="flex items-center justify-between gap-2 text-base font-bold">
        Dernières visites
        <Link
          href={ROUTES.siteVisits(siteId)}
          className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          Tout voir
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </h2>
      {sessions.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Aucune visite sur cette période.</p>
      ) : (
        <ol className="mt-2 flex flex-col">
          {sessions.map((session) => {
            const place = formatPlace(session);
            const device = formatSessionDevice(session.device, session.os);

            return (
              <li key={session.id} className="border-t border-border first:border-t-0">
                <Link
                  href={ROUTES.siteVisit(siteId, session.id)}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm hover:bg-cream-deep/60 focus-visible:outline-2 focus-visible:outline-foreground"
                >
                  <span aria-hidden className="w-5 shrink-0 text-center text-base leading-none">
                    {placeFlag(session.country) ?? "🌐"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{place ?? "Lieu inconnu"}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {formatSessionSource(session.utmSource, session.referrerDomain)}
                      {device ? ` · ${device}` : ""}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    <LocalTime iso={session.startedAt} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
