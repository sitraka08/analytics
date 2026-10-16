import { TONE_BG, TONE_TEXT, toneClass, type Tone } from "@/lib/tones";

type StatCardProps = {
  value: string;
  label: string;
  tone: Tone;
  shape: "capsules" | "rounded";
  className?: string;
};

const CAPSULE_COUNT = 4;

export function StatCard({ value, label, tone, shape, className = "" }: StatCardProps) {
  const shapeClass = shape === "rounded" ? `rounded-3xl ${toneClass(tone)}` : TONE_TEXT;

  return (
    <div className={`relative isolate flex min-h-48 flex-col justify-center px-5 py-8 sm:px-6 ${shapeClass} ${className}`}>
      {shape === "capsules" ? (
        <div aria-hidden className="absolute inset-0 -z-10 flex">
          {Array.from({ length: CAPSULE_COUNT }, (_, i) => (
            <span key={i} className={`flex-1 rounded-full ${TONE_BG[tone]}`} />
          ))}
        </div>
      ) : null}
      <span className="whitespace-nowrap font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{value}</span>
      <span className="mt-2 text-sm font-medium">{label}</span>
    </div>
  );
}
