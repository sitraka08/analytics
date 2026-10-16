import { HandDrawnUnderline } from "@/components/shared/hand-drawn-underline";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { BRAND } from "@/lib/brand";
import { HERO } from "../constants/content";
import { GlobeScene } from "./globe-scene";
import { HeroVisitorTrail } from "./hero-visitor-trail";
import { LandingHeader } from "./landing-header";
import { SignupForm } from "./signup-form";

export function LandingHero() {
  return (
    <div className="px-3 pt-3">
      <section className="relative rounded-t-4xl bg-cream-deep px-3 pb-16 pt-3 md:px-5 md:pt-5">
        <LandingHeader />

        <div className="relative mx-auto max-w-6xl pt-16 text-center md:pt-24">
          <HeroVisitorTrail side="left" />
          <HeroVisitorTrail side="right" />

          <RevealGroup trigger="mount" stagger={0.12}>
            <RevealItem>
              <h1 className="mx-auto max-w-3xl text-[2.1rem] font-bold leading-[1.15] tracking-tight sm:text-6xl lg:text-[4rem]">
                <span className="block">
                  {HERO.titleFirst}{" "}
                  <svg aria-hidden viewBox="0 0 24 24" className="inline-block size-[0.62em] align-[-0.02em] text-accent-green" fill="currentColor">
                    <path d="M3 2 22 9.6 13.4 12.4 10.4 21Z" />
                  </svg>{" "}
                  <span className="relative inline-block">
                    {HERO.titleSecond}
                    <HandDrawnUnderline />
                  </span>
                </span>
                <span className="block">{HERO.titleLine2}</span>
                <span className="relative mt-2 inline-block bg-highlight px-3 leading-[1.1]">
                  {BRAND.name}
                  <span aria-hidden className="absolute -right-0.5 top-0 h-full w-0.75 bg-brand-orange" />
                  <span className="absolute -top-3 left-full -translate-x-3 rounded-sm bg-brand-orange px-2 py-0.5 text-[0.65rem] font-medium leading-normal tracking-normal text-tone-foreground">
                    {HERO.tag}
                  </span>
                </span>
              </h1>
            </RevealItem>

            <RevealItem>
              <p className="mx-auto mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">{HERO.subtitle}</p>
            </RevealItem>

            <RevealItem className="mt-8">
              <SignupForm />
            </RevealItem>

            {/* Visitor trails only fit on very large screens: the globe takes over elsewhere. */}
            <RevealItem className="xl:hidden">
              <GlobeScene className="mx-auto mt-10 w-full max-w-xs sm:max-w-sm" />
            </RevealItem>
          </RevealGroup>
        </div>

        <div aria-hidden className="scallop-edge absolute inset-x-0 top-full h-12 md:h-20" />
      </section>
    </div>
  );
}
