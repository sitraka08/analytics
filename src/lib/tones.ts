export const TONE_BG = {
  blue: "bg-brand-blue",
  green: "bg-brand-green",
  orange: "bg-brand-orange",
  yellow: "bg-brand-yellow",
} as const;

export const TONE_TEXT = "text-tone-foreground";

export type Tone = keyof typeof TONE_BG;

export function toneClass(tone: Tone) {
  return `${TONE_BG[tone]} ${TONE_TEXT}`;
}
