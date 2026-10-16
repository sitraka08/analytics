import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Reveal } from "@/components/shared/reveal";
import { ROUTES } from "@/lib/routes";
import { AUTH_COPY } from "../constants/content";
import { AuthAside } from "./auth-aside";

// Deux colonnes : formulaire sur le fond crème, panneau de marque à droite (masqué sur mobile).
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen gap-3 bg-background p-3 lg:grid-cols-2">
      <div className="flex flex-col">
        <header className="flex items-center justify-between px-3 py-3 sm:px-6">
          <BrandLogo />
          <Link
            href={ROUTES.home}
            className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {AUTH_COPY.common.backHome}
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-3 py-10 sm:px-6">
          <Reveal trigger="mount" className="w-full max-w-sm">
            {children}
          </Reveal>
        </main>
      </div>

      <AuthAside />
    </div>
  );
}
