"use client";

import { m, type Variants } from "motion/react";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** "view": animates when entering the viewport; "mount": animates as soon as displayed (hero, auth cards). */
  trigger?: "view" | "mount";
};

export function Reveal({
  children,
  className,
  delay = 0,
  trigger = "view",
}: RevealProps) {
  const play =
    trigger === "mount"
      ? { animate: "visible" }
      : { whileInView: "visible", viewport: { once: true, amount: 0.2 } };

  return (
    <m.div
      className={className}
      initial="hidden"
      {...play}
      variants={itemVariants}
      transition={{ delay }}
    >
      {children}
    </m.div>
  );
}

type RevealGroupProps = Omit<RevealProps, "delay"> & {
  stagger?: number;
  as?: "div" | "ul";
};

export function RevealGroup({
  children,
  className,
  trigger = "view",
  stagger = 0.08,
  as = "div",
}: RevealGroupProps) {
  const Component = as === "ul" ? m.ul : m.div;
  const play =
    trigger === "mount"
      ? { animate: "visible" }
      : { whileInView: "visible", viewport: { once: true, amount: 0.15 } };

  return (
    <Component
      className={className}
      initial="hidden"
      {...play}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </Component>
  );
}

type RevealItemProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
  /** Slight lift on hover, for cards. */
  lift?: boolean;
};

export function RevealItem({
  children,
  className,
  as = "div",
  lift = false,
}: RevealItemProps) {
  const Component = as === "li" ? m.li : m.div;

  return (
    <Component
      className={className}
      variants={itemVariants}
      whileHover={
        lift
          ? { y: -6, transition: { duration: 0.25, ease: EASE_OUT } }
          : undefined
      }
    >
      {children}
    </Component>
  );
}
