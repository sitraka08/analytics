import { TRACKING_SCRIPT } from "@/features/tracking/constants/script";

export function GET() {
  return new Response(TRACKING_SCRIPT, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
