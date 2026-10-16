// Bureau dessiné au trait : ordinateur avec graphique, tasse fumante, plante et pense-bête.
// Traits légèrement irréguliers pour un rendu « fait main » ; couleurs uniquement via les tokens.
export function DeskScene({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 80 400 185"
      className={className}
      fill="none"
      stroke="var(--foreground)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Plante */}
      <path d="M52 196c-6-22-24-30-30-52 18 4 30 20 32 40" fill="var(--brand-green)" />
      <path d="M58 194c2-28 14-44 34-54-2 22-14 40-30 56" fill="var(--brand-green)" />
      <path d="M56 200c-2-34 2-62 10-84 8 24 6 52-2 82" fill="var(--brand-green)" />
      <path d="M36 200h44l-6 46c-1 4-3 5-7 5H49c-4 0-6-1-7-5Z" fill="var(--brand-orange)" />
      <path d="M40 214c12 2 26 2 38-1" strokeWidth="1.8" />

      {/* Écran */}
      <path d="M108 112c54-3 108-4 162-3 4 0 6 2 6 6l2 106c0 4-2 6-6 6-54 1-108 2-160 3-4 0-6-2-6-6l-4-106c0-4 2-6 6-6Z" fill="var(--surface)" />
      <path d="M128 200V180" stroke="var(--brand-blue)" strokeWidth="14" strokeLinecap="butt" />
      <path d="M154 200V160" stroke="var(--brand-green)" strokeWidth="14" strokeLinecap="butt" />
      <path d="M180 200V170" stroke="var(--brand-orange)" strokeWidth="14" strokeLinecap="butt" />
      <path d="M206 200V142" stroke="var(--brand-yellow)" strokeWidth="14" strokeLinecap="butt" />
      <path d="M120 202c40-1 80-1 112-2" strokeWidth="1.8" />
      <path d="M126 150c14-6 26 4 40-4s24-14 40-22" stroke="var(--brand-blue)" strokeDasharray="1 6" strokeWidth="3" />
      <circle cx="206" cy="124" r="4" fill="var(--brand-blue)" stroke="none" />

      {/* Pense-bête collé sur l'écran */}
      <path d="M232 126l34-4 4 34-34 4Z" fill="var(--brand-yellow)" />
      <path d="M242 142l6 6 12-14" strokeWidth="2.2" />

      {/* Clavier */}
      <path d="M96 236c64-2 128-3 192-3l14 16c-74 2-146 3-220 3Z" fill="var(--cream-deep)" />
      <path d="M176 244c12 0 22 0 32-1" strokeWidth="1.8" />

      {/* Tasse */}
      <path d="M318 206h36l-4 38c0 4-3 6-7 6h-14c-4 0-7-2-7-6Z" fill="var(--brand-blue)" />
      <path d="M352 214c10-2 14 6 10 14s-10 8-14 6" />
      <path d="M328 196c-4-8 4-12 0-20M342 196c-4-8 4-12 0-20" strokeWidth="2" />

      {/* Table */}
      <path d="M14 254c120-4 252-4 372-1" />

      {/* Petites étincelles */}
      <path d="M300 92v14M293 99h14" stroke="var(--brand-orange)" strokeWidth="2.2" />
      <path d="M86 92v10M81 97h10" stroke="var(--brand-blue)" strokeWidth="2.2" />
    </svg>
  );
}
