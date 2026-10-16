import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { FOOTER } from "../constants/content";
import { BrandLogo } from "@/components/shared/brand-logo";
import { ROUTES } from "@/lib/routes";

const LEGAL_LINKS = [
  { label: "Conditions d'utilisation", href: ROUTES.terms },
  { label: "Confidentialité", href: ROUTES.privacy },
  { label: "Mentions légales", href: ROUTES.legalNotice },
] as const;

export function LandingFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-10 text-sm text-muted-foreground">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
        <BrandLogo />
        <p>{FOOTER.tagline}</p>
        <nav aria-label="Informations légales">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="underline-offset-4 transition-colors hover:text-foreground hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p>
          © {BRAND.name}. {FOOTER.rights}
        </p>
      </div>
    </footer>
  );
}
