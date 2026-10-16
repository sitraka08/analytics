import { BrandLogo } from "@/components/shared/brand-logo";
import { LandingFooter } from "@/features/landing";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="mx-auto flex w-full max-w-6xl items-center px-4 pt-6">
        <BrandLogo />
      </header>
      <main>{children}</main>
      <LandingFooter />
    </>
  );
}
