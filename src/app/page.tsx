import {
  LandingFinalCta,
  LandingFooter,
  LandingHero,
  LandingPrivacy,
  LandingShowcase,
  LandingStats,
} from "@/features/landing";

export default function HomePage() {
  return (
    <>
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
