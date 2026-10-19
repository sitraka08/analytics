import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import type { SessionsPage } from "../types/session";
import { formatDuration, formatInteger } from "../utils/format";
import { formatPlace, placeFlag } from "../utils/place";
import { formatSessionDevice, formatSessionSource, formatSessionTime } from "../utils/session-label";
import { buildDashboardHref } from "../utils/search-params";

type SessionTableProps = { siteId: string; data: SessionsPage; period: Period; filters: Filters; basePath: string };

export function SessionTable({ siteId, data, period, filters, basePath }: SessionTableProps) {
  const { sessions, total, page, pageSize } = data;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const pageHref = (target: number) => {
    const href = buildDashboardHref(basePath, period, filters);
    if (target === 1) return href;
    return `${href}${href.includes("?") ? "&" : "?"}p=${target}`;
  };

  if (sessions.length === 0) {
    return (
      <p className="rounded-3xl bg-cream-deep px-5 py-4 text-sm">
        Aucune visite sur cette période. Choisissez une période plus longue ou retirez un filtre.
      </p>
    );
  }

  return (
    <section aria-labelledby="visits-title" className="rounded-3xl bg-surface p-5">
      <h2 id="visits-title" className="flex items-baseline gap-2 text-base font-bold">
        Visites récentes
        <span className="text-xs font-normal text-muted-foreground tabular-nums">{formatInteger(total)} au total</span>
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="pr-4 pb-2 font-normal">Début</th>
              <th scope="col" className="pr-4 pb-2 font-normal">Lieu</th>
              <th scope="col" className="pr-4 pb-2 font-normal">Appareil</th>
              <th scope="col" className="pr-4 pb-2 font-normal">Source</th>
              <th scope="col" className="pr-4 pb-2 text-right font-normal">Pages</th>
              <th scope="col" className="pb-2 text-right font-normal">Durée</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const place = formatPlace(session);
              const device = formatSessionDevice(session.device, session.os);

              return (
                <tr key={session.id} className="border-t border-border hover:bg-cream-deep/60">
                  <td className="py-2.5 pr-4 whitespace-nowrap">
                    <Link
                      href={ROUTES.siteVisit(siteId, session.id)}
                      className="font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                    >
                      {formatSessionTime(session.startedAt, period.tz)}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="flex items-center gap-2">
                      <span aria-hidden>{placeFlag(session.country)}</span>
                      <span>{place ?? <span className="text-muted-foreground">Inconnu</span>}</span>
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">
                    {device ?? <span className="text-muted-foreground">Inconnu</span>}
                    {session.browser ? <span className="text-muted-foreground"> · {session.browser}</span> : null}
                  </td>
                  <td className="py-2.5 pr-4">{formatSessionSource(session.utmSource, session.referrerDomain)}</td>
                  <td className="py-2.5 pr-4 text-right font-mono tabular-nums">{formatInteger(session.pageviews)}</td>
                  <td className="py-2.5 text-right font-mono whitespace-nowrap tabular-nums">
                    {session.durationMs !== null ? formatDuration(session.durationMs) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pageCount > 1 ? (
        <nav aria-label="Pagination" className="mt-4 flex items-center justify-between gap-3 text-sm">
          {page > 1 ? (
            <Link href={pageHref(page - 1)} className="inline-flex h-9 items-center gap-1 rounded-full border-[1.5px] border-input bg-surface pr-4 pl-2 font-medium hover:bg-cream-deep">
              <ChevronLeft aria-hidden className="size-4" />
              Plus récentes
            </Link>
          ) : (
            <span />
          )}
          <span className="text-muted-foreground tabular-nums">
            Page {formatInteger(page)} sur {formatInteger(pageCount)}
          </span>
          {page < pageCount ? (
            <Link href={pageHref(page + 1)} className="inline-flex h-9 items-center gap-1 rounded-full border-[1.5px] border-input bg-surface pr-2 pl-4 font-medium hover:bg-cream-deep">
              Plus anciennes
              <ChevronRight aria-hidden className="size-4" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </section>
  );
}
