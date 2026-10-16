import {
  LandingFinalCta,
  LandingFooter,
  LandingHeader,
  LandingHero,
  LandingPrivacy,
  LandingShowcase,
  LandingStats,
} from "@/features/landing";

export default function HomePage() {
  return (
    <>
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingStats />
        <LandingPrivacy />
        <LandingShowcase />
        <LandingFinalCta />
      </main>
      <LandingFooter />
    </>
  );
}
