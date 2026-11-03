import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import type { Session } from "../types/session";
import { formatPlace, placeFlag } from "../utils/place";
import { formatSessionDevice, formatSessionSource } from "../utils/session-label";
import { LocalTime } from "./local-time";
import { Panel } from "./panel";

type RecentVisitsProps = { siteId: string; sessions: Session[]; busy?: boolean };

export function RecentVisits({ siteId, sessions, busy }: RecentVisitsProps) {
  return (
    <Panel
      title="Dernières visites"
      busy={busy}
      className="h-full"
      action={
        <Link
          href={ROUTES.siteVisits(siteId)}
          className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          Tout voir
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      }
    >
      {sessions.length === 0 ? (
        <p className="rounded-2xl bg-cream-deep px-4 py-3 text-sm text-muted-foreground">Aucune visite sur cette période.</p>
      ) : (
        <ol className="-mx-2 flex flex-col">
          {sessions.map((session) => {
            const place = formatPlace(session);
            const device = formatSessionDevice(session.device, session.os);

            return (
              <li key={session.id} className="border-t border-border/70 first:border-t-0">
                <Link
                  href={ROUTES.siteVisit(siteId, session.id)}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm hover:bg-cream-deep/60 focus-visible:outline-2 focus-visible:outline-foreground"
                >
                  <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-cream-deep text-base leading-none">
                    {placeFlag(session.country) ?? "🌐"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{place ?? "Lieu inconnu"}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {formatSessionSource(session.utmSource, session.referrerDomain)}
                      {device ? ` · ${device}` : ""}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                    <LocalTime iso={session.startedAt} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </Panel>
  );
}
