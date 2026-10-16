import { BRAND } from "@/lib/brand";
import { FOOTER } from "../constants/content";
import { BrandLogo } from "@/components/shared/brand-logo";

export function LandingFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-10 text-sm text-muted-foreground">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
        <BrandLogo />
        <p>{FOOTER.tagline}</p>
        <p>
          © {BRAND.name}. {FOOTER.rights}
        </p>
      </div>
    </footer>
  );
}
