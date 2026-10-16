import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { HEADER_ACTIONS, NAV_LINKS } from "../constants/content";
import { BrandLogo } from "@/components/shared/brand-logo";

export function LandingHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-xl bg-surface px-3 py-2.5 shadow-sm">
      <BrandLogo />

      <nav aria-label="Navigation principale" className="hidden md:block">
        <ul className="flex items-center gap-8 text-sm text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-2">
        <Link
          href={ROUTES.login}
          className="hidden rounded-full bg-cream-deep px-4 py-2 text-sm font-medium transition-colors hover:bg-line sm:block"
        >
          {HEADER_ACTIONS.login}
        </Link>
        <Link
          href={ROUTES.register}
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85"
        >
          {HEADER_ACTIONS.register}
        </Link>
      </div>
    </header>
  );
}
