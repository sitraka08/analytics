import { toneClass, type Tone } from "@/lib/tones";

type MetricPillProps = {
  tone: Tone;
  children: React.ReactNode;
};

export function MetricPill({ tone, children }: MetricPillProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${toneClass(tone)}`}>
      <svg aria-hidden viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v3l2 1.5" />
      </svg>
      {children}
    </span>
  );
}
