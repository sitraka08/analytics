import { Globe, Plus } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import type { SiteSummary } from "../types/site";

export function SiteList({ sites }: { sites: SiteSummary[] }) {
  if (sites.length === 0) {
    return (
      <div className="rounded-4xl bg-cream-deep p-8 sm:p-10">
        <h2 className="text-xl font-bold">Aucun site pour le moment</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Ajoutez votre premier site, puis collez une ligne de code dans ses pages pour voir arriver les premières visites.
        </p>
        <Link
          href={ROUTES.newSite}
          className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-base font-medium text-primary-foreground hover:bg-primary/85"
        >
          <Plus aria-hidden className="size-4" />
          Ajouter un site
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {sites.map((item) => (
        <li key={item.id}>
          <Link
            href={ROUTES.site(item.id)}
            className="flex items-center gap-4 rounded-3xl border-2 border-foreground/15 bg-surface p-5 transition-colors hover:border-foreground/35"
          >
            <span aria-hidden className="grid size-11 place-items-center rounded-full bg-cream-deep">
              <Globe className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-heading font-bold">{item.name}</span>
              <span className="block truncate text-sm text-muted-foreground">{item.domain}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
