import { toneClass, type Tone } from "@/lib/tones";

const SHAPE_CLASS = {
  rounded: "rounded-3xl",
  leaf: "rounded-[3.5rem_1.25rem_3.5rem_1.25rem]",
  "leaf-alt": "rounded-[1.25rem_3.5rem_1.25rem_3.5rem]",
} as const;

type StatCardProps = {
  value: string;
  label: string;
  tone: Tone;
  shape: keyof typeof SHAPE_CLASS;
  className?: string;
};

export function StatCard({
  value,
  label,
  tone,
  shape,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`flex min-h-48 flex-col justify-center px-5 py-8 sm:px-8 ${SHAPE_CLASS[shape]} ${toneClass(tone)} ${className}`}
    >
      <span className="whitespace-nowrap font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        {value}
      </span>
      <span className="mt-2 text-sm font-medium">{label}</span>
    </div>
  );
}
