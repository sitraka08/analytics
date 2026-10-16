// Irregular stroke under a key word, like a marker underline. Place it in a `relative inline-block` parent.
export function HandDrawnUnderline({ className = "-bottom-2 h-3 w-[108%]" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      className={`absolute left-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M3 9C55 3 130 2 197 7" />
      <path d="M140 11C160 9.5 178 9.5 192 11" strokeWidth="1.5" />
    </svg>
  );
}
