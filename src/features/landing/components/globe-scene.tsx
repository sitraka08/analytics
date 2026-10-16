// Line-drawn globe with pins linked by dotted lines: visitors from everywhere.
export function GlobeScene({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 300"
      className={className}
      fill="none"
      stroke="var(--foreground)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Globe */}
      <path d="M200 46c58-1 104 46 104 104s-46 106-104 106S94 208 96 150 142 47 200 46Z" fill="var(--surface)" />
      <path d="M200 48c-30 30-36 168 0 206M200 48c30 30 36 168 0 206" strokeWidth="1.6" />
      <path d="M102 120c64 8 132 8 196 0M100 182c66-8 134-8 200 0" strokeWidth="1.6" />

      {/* Continents */}
      <path d="M130 96c16-10 34-6 40 6s-4 22 6 32-6 24-20 18-10-20-24-22-18-24-2-34Z" fill="var(--brand-green)" />
      <path d="M214 84c18-6 40 0 46 14s-10 18-4 30-14 18-24 8-4-18-16-22-14-24-2-30Z" fill="var(--brand-green)" />
      <path d="M212 174c14-4 30 4 30 18s-12 28-24 28-10-14-16-24 0-20 10-22Z" fill="var(--brand-green)" />
      <path d="M146 186c10-2 18 6 16 14s-12 12-18 6-8-18 2-20Z" fill="var(--brand-green)" />

      {/* Paths between pins */}
      <path d="M150 112c20-40 70-50 100-26" strokeDasharray="5 6" strokeWidth="1.8" />
      <path d="M252 92c40 20 40 80-26 102" strokeDasharray="5 6" strokeWidth="1.8" />

      {/* Épingles */}
      <path d="M150 112c-10-12-14-18-14-24a14 14 0 0 1 28 0c0 6-4 12-14 24Z" fill="var(--brand-orange)" />
      <circle cx="150" cy="88" r="4.5" fill="var(--surface)" />
      <path d="M252 92c-10-12-14-18-14-24a14 14 0 0 1 28 0c0 6-4 12-14 24Z" fill="var(--brand-yellow)" />
      <circle cx="252" cy="68" r="4.5" fill="var(--surface)" />
      <path d="M226 194c-10-12-14-18-14-24a14 14 0 0 1 28 0c0 6-4 12-14 24Z" fill="var(--brand-blue)" />
      <circle cx="226" cy="170" r="4.5" fill="var(--surface)" />

      {/* Avion de papier */}
      <path d="M318 74l44-16-18 42-8-16Z" fill="var(--brand-yellow)" />
      <path d="M336 84l26-26" strokeWidth="1.8" />
      <path d="M312 92c-14 8-26 6-36 14" strokeDasharray="4 6" strokeWidth="1.8" />

      {/* Socle */}
      <path d="M160 270c26-4 54-4 80 0" />
      <path d="M200 256v14" />

      {/* Étincelles */}
      <path d="M70 100v14M63 107h14" stroke="var(--brand-orange)" strokeWidth="2.2" />
      <path d="M340 200v10M335 205h10" stroke="var(--brand-blue)" strokeWidth="2.2" />
    </svg>
  );
}
