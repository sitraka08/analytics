const FLAGS = {
  mg: (
    <>
      <rect width="30" height="15" fill="#fc3d32" />
      <rect y="15" width="30" height="15" fill="#007e3a" />
      <rect width="11" height="30" fill="#fff" />
    </>
  ),
  fr: (
    <>
      <rect width="10" height="30" fill="#002395" />
      <rect x="10" width="10" height="30" fill="#fff" />
      <rect x="20" width="10" height="30" fill="#ed2939" />
    </>
  ),
  be: (
    <>
      <rect width="10" height="30" fill="#1a1a1a" />
      <rect x="10" width="10" height="30" fill="#fdda24" />
      <rect x="20" width="10" height="30" fill="#ef3340" />
    </>
  ),
  ci: (
    <>
      <rect width="10" height="30" fill="#f77f00" />
      <rect x="10" width="10" height="30" fill="#fff" />
      <rect x="20" width="10" height="30" fill="#009e60" />
    </>
  ),
  de: (
    <>
      <rect width="30" height="10" fill="#1a1a1a" />
      <rect y="10" width="30" height="10" fill="#dd0000" />
      <rect y="20" width="30" height="10" fill="#ffce00" />
    </>
  ),
  jp: (
    <>
      <rect width="30" height="30" fill="#fff" />
      <circle cx="15" cy="15" r="7" fill="#bc002d" />
    </>
  ),
};

export type FlagCode = keyof typeof FLAGS;

export function VisitorFlag({ code }: { code: FlagCode }) {
  return (
    <svg viewBox="0 0 30 30" className="size-full rounded-full">
      <clipPath id={`flag-${code}`}>
        <circle cx="15" cy="15" r="15" />
      </clipPath>
      <g clipPath={`url(#flag-${code})`}>{FLAGS[code]}</g>
    </svg>
  );
}
