import { DeskScene } from "@/components/shared/illustrations/desk-scene";
import { getScriptUrl } from "../utils/script-url";
import { InstallTabs } from "./install-tabs";
import { WaitingForVisit } from "./waiting-for-visit";

type InstallSnippetProps = {
  publicKey: string;
  domain: string;
  /** Polls for the first visit; off where the site may already be receiving visits (site settings). */
  waitForVisit?: boolean;
};

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden
        className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground font-heading text-xs font-bold text-background"
      >
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold">{title}</h3>
        <div className="mt-2">{children}</div>
      </div>
    </li>
  );
}

export function InstallSnippet({ publicKey, domain, waitForVisit = true }: InstallSnippetProps) {
  // Sites hosted on Vercel are most often Next.js projects.
  const initialGuideId = domain.endsWith(".vercel.app") ? "nextjs" : undefined;

  return (
    <section aria-labelledby="install-title" className="grid gap-3 lg:grid-cols-5">
      <div className="rounded-3xl bg-cream-deep p-4 sm:p-5 lg:col-span-3">
        <h2 id="install-title" className="text-xl font-bold">
          Installer le script
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Trois étapes, moins d&apos;une minute. Aucun cookie ni stockage : pas de bandeau de consentement.
        </p>

        <ol className="mt-5 flex flex-col gap-5">
          <Step number={1} title="Choisissez votre stack et collez le code">
            <InstallTabs scriptUrl={getScriptUrl()} publicKey={publicKey} initialGuideId={initialGuideId} />
          </Step>
          <Step number={2} title="Publiez votre site, puis ouvrez-le">
            <p className="text-sm text-muted-foreground">
              Chargez une page de <span className="font-medium text-foreground">{domain}</span>. Le script se charge sans bloquer l&apos;affichage.
            </p>
          </Step>
          <Step number={3} title="Vérifiez la réception">
            {waitForVisit ? (
              <WaitingForVisit />
            ) : (
              <p className="text-sm text-muted-foreground">Les visites apparaissent dans les statistiques quelques secondes après le chargement d&apos;une page.</p>
            )}
          </Step>
        </ol>

        <details className="mt-5 rounded-2xl bg-surface px-4 py-3 text-sm">
          <summary className="cursor-pointer font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">
            Ne pas compter mes propres visites
          </summary>
          <p className="mt-2 text-muted-foreground">
            Ouvrez une fois votre site avec <code className="font-mono">?no-track</code> à la fin de l&apos;adresse. Ce navigateur sera
            ignoré ; <code className="font-mono">?no-track=0</code> réactive le suivi.
          </p>
        </details>
      </div>

      <div className="hidden items-center rounded-3xl bg-surface p-5 lg:col-span-2 lg:flex">
        <DeskScene className="w-full" />
      </div>
    </section>
  );
}
