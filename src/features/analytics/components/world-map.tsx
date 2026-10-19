import { geoNaturalEarth1, geoPath } from "d3-geo";
import type { FeatureCollection, Geometry } from "geojson";
import Link from "next/link";
import { feature } from "topojson-client";
import topology from "world-atlas/countries-110m.json";
import { cn } from "@/lib/utils";
import { COUNTRY_ALPHA2_BY_NUMERIC } from "../constants/country-numeric-codes";
import { formatFilterValue } from "../utils/filter-label";
import { formatInteger } from "../utils/format";

const WIDTH = 960;
const HEIGHT = 480;
const ANTARCTICA = "010";

type WorldTopology = Parameters<typeof feature>[0];
type CountryCollection = FeatureCollection<Geometry, { name: string }>;

// The JSON import is typed structurally; the cast narrows it to the shape world-atlas documents.
const world = topology as unknown as WorldTopology & { objects: { countries: Parameters<typeof feature>[1] } };
const countries = feature(world, world.objects.countries) as unknown as CountryCollection;
const land = { ...countries, features: countries.features.filter((item) => item.id !== ANTARCTICA) };
const toPath = geoPath(geoNaturalEarth1().fitSize([WIDTH, HEIGHT], land)).digits(1);

// Projected once at module load: the geometry never changes between requests.
const SHAPES = land.features.flatMap((item) => {
  const code = COUNTRY_ALPHA2_BY_NUMERIC[String(item.id)];
  const d = toPath(item);
  return d ? [{ code: code?.toUpperCase() ?? null, name: item.properties.name, d }] : [];
});

export type MapCountry = { code: string; visitors: number; href: string; active: boolean };

type WorldMapProps = { countries: MapCountry[] };

/** Choropleth rendered on the server: countries with visitors are links that apply the country filter. */
export function WorldMap({ countries: rows }: WorldMapProps) {
  const byCode = new Map(rows.map((row) => [row.code.toUpperCase(), row]));
  const max = Math.max(...rows.map((row) => row.visitors), 1);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Carte du monde des visiteurs par pays" className="h-auto w-full">
      {SHAPES.map((shape) => {
        const row = shape.code ? byCode.get(shape.code) : undefined;
        if (!row) return <path key={shape.name} d={shape.d} className="fill-foreground/10 stroke-surface" strokeWidth={0.5} />;

        const label = `${formatFilterValue("country", row.code)} : ${formatInteger(row.visitors)} ${row.visitors > 1 ? "visiteurs" : "visiteur"}`;
        return (
          <Link key={shape.name} href={row.href} scroll={false} aria-label={label} aria-current={row.active ? "true" : undefined}>
            <path
              d={shape.d}
              strokeWidth={row.active ? 1.5 : 0.5}
              className={cn("fill-brand-blue stroke-surface hover:stroke-foreground", row.active && "stroke-foreground")}
              style={{ fillOpacity: 0.3 + 0.7 * (row.visitors / max) }}
            >
              <title>{label}</title>
            </path>
          </Link>
        );
      })}
    </svg>
  );
}
