import { countryFlag } from "./country-flag";
import { formatFilterValue } from "./filter-label";

/** "Antananarivo, Madagascar"; falls back to the country alone, then to null when nothing is known. */
export function formatPlace({
  city,
  country,
}: {
  city: string | null;
  country: string | null;
}) {
  const countryName = country ? formatFilterValue("country", country) : null;
  return [city, countryName].filter(Boolean).join(", ") || null;
}

export function placeFlag(country: string | null) {
  return country ? countryFlag(country) : null;
}
