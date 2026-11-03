"use client";

import { m } from "motion/react";
import { EASE_OUT } from "@/components/shared/reveal";
import { toneClass, type Tone } from "@/lib/tones";
import { VisitorFlag, type FlagCode } from "./visitor-flag";

type Visitor = {
  city: string;
  flag: FlagCode;
  tone: Tone;
  x: number;
  y: number;
  pill: "left" | "right";
  live?: boolean;
};

// Coordinates in a 220 × 340 box, the right side mirrors the left.
const BOX_WIDTH = 220;
const BOX_HEIGHT = 340;
const AVATAR_SIZE = 52;

const TRAILS: Record<
  "left" | "right",
  { visitors: Visitor[]; paths: string[] }
> = {
  left: {
    visitors: [
      {
        city: "Antananarivo",
        flag: "mg",
        tone: "violet",
        x: 40,
        y: 30,
        pill: "right",
        live: true,
      },
      {
        city: "Paris",
        flag: "fr",
        tone: "green",
        x: 160,
        y: 160,
        pill: "left",
      },
      {
        city: "Bruxelles",
        flag: "be",
        tone: "blue",
        x: 40,
        y: 300,
        pill: "right",
      },
    ],
    paths: [
      "M40 58 V150 Q40 160 50 160 H132",
      "M160 188 V290 Q160 300 150 300 H68",
    ],
  },
  right: {
    visitors: [
      {
        city: "Abidjan",
        flag: "ci",
        tone: "blue",
        x: 180,
        y: 30,
        pill: "left",
      },
      {
        city: "Berlin",
        flag: "de",
        tone: "violet",
        x: 60,
        y: 160,
        pill: "right",
      },
      {
        city: "Tokyo",
        flag: "jp",
        tone: "green",
        x: 180,
        y: 300,
        pill: "left",
        live: true,
      },
    ],
    paths: [
      "M180 58 V150 Q180 160 170 160 H88",
      "M60 188 V290 Q60 300 70 300 H152",
    ],
  },
};

function CursorIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor">
      <path d="M2 1.5 14 6.5 8.6 8.3 6.6 14Z" />
    </svg>
  );
}

export function HeroVisitorTrail({ side }: { side: "left" | "right" }) {
  const { visitors, paths } = TRAILS[side];

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute top-6 hidden h-85 w-55 xl:block ${side === "left" ? "left-0" : "right-0"}`}
    >
      <svg
        viewBox={`0 0 ${BOX_WIDTH} ${BOX_HEIGHT}`}
        className="absolute inset-0 size-full text-muted-foreground/50"
        fill="none"
      >
        {/* The progressive stroke goes through a mask to keep the dotted pattern. */}
        <defs>
          {paths.map((d, i) => (
            <mask
              key={d}
              id={`trail-${side}-${i}`}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={BOX_WIDTH}
              height={BOX_HEIGHT}
            >
              <m.path
                d={d}
                stroke="white"
                strokeWidth="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.9,
                  delay: 0.6 + i * 0.45,
                  ease: EASE_OUT,
                }}
              />
            </mask>
          ))}
        </defs>
        {paths.map((d, i) => (
          <path
            key={d}
            d={d}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            mask={`url(#trail-${side}-${i})`}
          />
        ))}
      </svg>

      {visitors.map((visitor, i) => (
        <m.div
          key={visitor.city}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 + i * 0.45, ease: EASE_OUT }}
        >
          <m.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5 + i * 0.3,
            }}
          >
            <div
              className={`absolute grid place-items-center rounded-full p-1.25 shadow-md ${toneClass(visitor.tone)}`}
              style={{
                left: visitor.x - AVATAR_SIZE / 2,
                top: visitor.y - AVATAR_SIZE / 2,
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
              }}
            >
              <span className="size-full overflow-hidden rounded-full ring-2 ring-surface">
                <VisitorFlag code={visitor.flag} />
              </span>
            </div>

            <div
              className="absolute flex items-center"
              style={
                visitor.pill === "right"
                  ? {
                      left: visitor.x + AVATAR_SIZE / 2 - 4,
                      top: visitor.y + (visitor.live ? 10 : -12),
                    }
                  : {
                      right: BOX_WIDTH - visitor.x + AVATAR_SIZE / 2 - 4,
                      top: visitor.y + (visitor.live ? 10 : -12),
                    }
              }
            >
              {visitor.live && visitor.pill === "right" ? (
                <CursorIcon className="absolute -top-3 left-0 size-4 text-brand-blue" />
              ) : null}
              {visitor.live && visitor.pill === "left" ? (
                <CursorIcon className="absolute -top-3 -left-3 size-4 text-brand-blue" />
              ) : null}
              <span
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium shadow-sm ${
                  visitor.live
                    ? "bg-brand-blue text-white"
                    : "bg-surface text-foreground"
                }`}
              >
                {visitor.city}
              </span>
            </div>
          </m.div>
        </m.div>
      ))}
    </div>
  );
}
