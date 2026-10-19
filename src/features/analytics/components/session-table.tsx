import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import type { SessionsPage } from "../types/session";
import { formatDuration, formatInteger } from "../utils/format";
import { formatPlace, placeFlag } from "../utils/place";
import { formatSessionDevice, formatSessionSource } from "../utils/session-label";
import { buildDashboardHref } from "../utils/search-params";
import { LocalTime } from "./local-time";

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
    <section aria-labelledby="visits-title" className="rounded-3xl bg-surface p-4">
      <h2 id="visits-title" className="flex items-baseline gap-2 px-2 text-base font-bold">
        Visites récentes
        <span className="text-xs font-normal text-muted-foreground tabular-nums">{formatInteger(total)} au total</span>
      </h2>

      <div aria-hidden className="mt-3 hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)_minmax(0,1.2fr)_4rem_5.5rem_1rem] gap-4 px-2 pb-1 text-xs text-muted-foreground md:grid">
        <span>Lieu et début</span>
        <span>Appareil</span>
        <span>Source</span>
        <span className="text-right">Pages</span>
        <span className="text-right">Durée</span>
        <span />
      </div>
      <ol className="mt-1 flex flex-col gap-0.5 md:mt-0">
        {sessions.map((session) => {
          const place = formatPlace(session);
          const device = formatSessionDevice(session.device, session.os);
          const source = formatSessionSource(session.utmSource, session.referrerDomain);
          const pages = `${formatInteger(session.pageviews)} ${session.pageviews > 1 ? "pages" : "page"}`;
          const duration = session.durationMs !== null ? formatDuration(session.durationMs) : "—";

          return (
            <li key={session.id}>
              <Link
                href={ROUTES.siteVisit(siteId, session.id)}
                className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-2xl px-2 py-2.5 text-sm hover:bg-cream-deep/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-foreground md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)_minmax(0,1.2fr)_4rem_5.5rem_1rem] md:gap-4"
              >
                <span className="col-span-2 flex min-w-0 items-center gap-3 md:col-span-1">
                  <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cream-deep text-lg leading-none">
                    {placeFlag(session.country) ?? "🌐"}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{place ?? "Lieu inconnu"}</span>
                    <span className="block text-xs text-muted-foreground tabular-nums">
                      <LocalTime iso={session.startedAt} />
                    </span>
                  </span>
                </span>
                <ChevronRight aria-hidden className="size-4 justify-self-end text-muted-foreground transition-transform group-hover:translate-x-0.5 md:order-last" />
                <span className="col-span-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground md:contents">
                  <span className="min-w-0 truncate text-sm text-foreground">
                    {device ?? "Appareil inconnu"}
                    {session.browser ? <span className="text-muted-foreground"> · {session.browser}</span> : null}
                  </span>
                  <span className="min-w-0 truncate text-sm text-foreground">
                    <span className="text-muted-foreground md:hidden">via </span>
                    {source}
                  </span>
                  <span className="font-mono tabular-nums md:text-right md:text-sm md:text-foreground">
                    <span className="md:hidden">{pages}</span>
                    <span className="hidden md:inline">{formatInteger(session.pageviews)}</span>
                  </span>
                  <span className="font-mono whitespace-nowrap tabular-nums md:text-right md:text-sm md:text-foreground">
                    <span className="md:hidden">· </span>
                    {duration}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      {pageCount > 1 ? (
        <nav aria-label="Pagination" className="mt-3 flex items-center justify-between gap-3 text-sm">
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
