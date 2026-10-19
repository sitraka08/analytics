const REGIONAL_INDICATOR_A = 0x1f1e6;

/** Flag emoji of an ISO 3166-1 alpha-2 code ("FR" → "🇫🇷"); null when the code is not two letters. */
export function countryFlag(code: string) {
  if (!/^[A-Za-z]{2}$/.test(code)) return null;

  return String.fromCodePoint(...[...code.toUpperCase()].map((letter) => REGIONAL_INDICATOR_A + letter.charCodeAt(0) - 65));
}
