import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#121212",
      }}
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f6f5f1"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M5 19v-6M12 19V6M19 19v-9" />
      </svg>
    </div>,
    size,
  );
}
