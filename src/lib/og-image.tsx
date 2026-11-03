import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = `${BRAND.name} — Des statistiques web enfin lisibles`;

// Brand colors are literals: ImageResponse cannot read CSS variables.
const TILES = [
  {
    value: "0",
    label: "cookie",
    color: "#4a6cf7",
    radius: "56px 28px 56px 28px",
  },
  {
    value: "< 2 Ko",
    label: "de script",
    color: "#7dd389",
    radius: "28px 56px 28px 56px",
  },
  {
    value: "1 ligne",
    label: "de code",
    color: "#ff6633",
    radius: "56px 28px 56px 28px",
  },
];

export function createOgImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 72,
        background: "#f6f5f1",
        color: "#121212",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 128,
            height: 128,
            borderRadius: 32,
            background: "#121212",
          }}
        >
          <svg
            width="72"
            height="72"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f6f5f1"
            strokeWidth="3.5"
            strokeLinecap="round"
          >
            <path d="M5 19v-6M12 19V6M19 19v-9" />
          </svg>
        </div>
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2 }}>
          {BRAND.name}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          Des statistiques web enfin lisibles
        </div>
        <div style={{ fontSize: 32, color: "#5c5a54" }}>
          Pays, pages, appareils et sources. Sans cookie.
        </div>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {TILES.map((tile) => (
          <div
            key={tile.label}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              padding: "16px 32px",
              background: tile.color,
              color: "#fff",
              borderRadius: tile.radius,
            }}
          >
            <div style={{ fontSize: 44, fontWeight: 800 }}>{tile.value}</div>
            <div style={{ fontSize: 26, fontWeight: 600 }}>{tile.label}</div>
          </div>
        ))}
      </div>
    </div>,
    OG_SIZE,
  );
}
