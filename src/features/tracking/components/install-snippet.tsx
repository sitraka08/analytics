import { getScriptUrl } from "../utils/script-url";
import { CopyButton } from "./copy-button";

export function InstallSnippet({ publicKey }: { publicKey: string }) {
  const snippet = `<script defer src="${getScriptUrl()}" data-key="${publicKey}"></script>`;

  return (
    <section aria-labelledby="install-title" className="rounded-4xl bg-cream-deep p-6 sm:p-8">
      <h2 id="install-title" className="text-xl font-bold">
        Installer le script
      </h2>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Collez cette ligne dans le <code className="font-mono">&lt;head&gt;</code> de chaque page du site. Le script n&apos;utilise ni
        cookie ni stockage : aucun bandeau de consentement n&apos;est nécessaire.
      </p>
      <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        <code className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-sm">{snippet}</code>
        <CopyButton value={snippet} />
      </div>
    </section>
  );
}
