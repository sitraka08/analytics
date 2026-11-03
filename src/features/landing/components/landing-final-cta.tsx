import { DeskScene } from "@/components/shared/illustrations/desk-scene";
import { Reveal } from "@/components/shared/reveal";
import { FINAL_CTA } from "../constants/content";
import { SignupForm } from "./signup-form";

export function LandingFinalCta() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16">
      <Reveal className="grid items-center gap-10 rounded-4xl bg-cream-deep px-6 py-14 text-center md:grid-cols-2 md:px-12 md:py-16 md:text-left">
        <div>
          <h2 className="mx-auto max-w-xl text-balance text-3xl font-bold leading-tight tracking-tight md:mx-0 md:text-[2.75rem]">
            {FINAL_CTA.title}
          </h2>
          <p className="mx-auto mb-8 mt-4 max-w-md text-base leading-relaxed text-muted-foreground md:mx-0">
            {FINAL_CTA.text}
          </p>
          <SignupForm className="md:mx-0" />
        </div>
        <DeskScene className="mx-auto w-full max-w-sm md:max-w-none" />
      </Reveal>
    </section>
  );
}
