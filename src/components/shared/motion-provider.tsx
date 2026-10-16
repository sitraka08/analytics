"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

// Charge uniquement les fonctionnalités d'animation DOM et respecte la préférence « réduire les animations ».
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
