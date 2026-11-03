import type { SessionDetail as SessionDetailData } from "../types/session";
import { formatDuration, formatInteger } from "../utils/format";
import { formatPlace, placeFlag } from "../utils/place";
import {
  formatSessionDevice,
  formatSessionSource,
} from "../utils/session-label";
import { LocalTime } from "./local-time";

type SessionDetailProps = { session: SessionDetailData };

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-surface p-4">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-base font-bold break-words">{children}</dd>
    </div>
  );
}

const unknown = (
  <span className="font-normal text-muted-foreground">Inconnu</span>
);

export function SessionDetail({ session }: SessionDetailProps) {
  const place = formatPlace(session);
  const device = formatSessionDevice(session.device, session.os);
  const campaign = [session.utmMedium, session.utmCampaign]
    .filter(Boolean)
    .join(" · ");
  const startMs = new Date(session.startedAt).getTime();

  return (
    <>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Fact label="Lieu">
          {place ? (
            <>
              <span aria-hidden>{placeFlag(session.country)} </span>
              {place}
              {session.region ? (
                <span className="font-normal text-muted-foreground">
                  {" "}
                  ({session.region})
                </span>
              ) : null}
            </>
          ) : (
            unknown
          )}
        </Fact>
        <Fact label="Appareil">{device ?? unknown}</Fact>
        <Fact label="Navigateur">{session.browser ?? unknown}</Fact>
        <Fact label="Source">
          {formatSessionSource(session.utmSource, session.referrerDomain)}
          {campaign ? (
            <span className="font-normal text-muted-foreground">
              {" "}
              · {campaign}
            </span>
          ) : null}
        </Fact>
        <Fact label="Début de la visite">
          <LocalTime iso={session.startedAt} variant="long" />
        </Fact>
        <Fact label="Durée mesurée">
          {session.durationMs !== null
            ? formatDuration(session.durationMs)
            : unknown}
        </Fact>
      </dl>

      <section
        aria-labelledby="path-title"
        className="mt-4 rounded-3xl bg-surface p-5"
      >
        <h2
          id="path-title"
          className="flex items-baseline gap-2 text-base font-bold"
        >
          Parcours
          <span className="text-xs font-normal text-muted-foreground tabular-nums">
            {formatInteger(session.pageviews.length)}{" "}
            {session.pageviews.length > 1 ? "pages vues" : "page vue"}
          </span>
        </h2>
        <ol className="mt-4 flex flex-col">
          {session.pageviews.map((view, index) => {
            const offsetSeconds = Math.round(
              (new Date(view.at).getTime() - startMs) / 1000,
            );

            return (
              <li
                key={`${view.at}-${index}`}
                className="group relative flex gap-4 pb-5 last:pb-0"
              >
                <span
                  aria-hidden
                  className="absolute top-3 bottom-0 left-[0.4375rem] w-0.5 bg-border group-last:hidden"
                />
                <span
                  aria-hidden
                  className="relative mt-1.5 size-4 shrink-0 rounded-full border-2 border-foreground bg-surface"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm break-all">{view.path}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                    <LocalTime iso={view.at} variant="clock" />
                    {index > 0
                      ? ` · +${formatDuration(offsetSeconds * 1000)}`
                      : ""}
                    {" · "}
                    {view.durationMs !== null
                      ? `resté ${formatDuration(view.durationMs)}`
                      : "durée inconnue"}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
