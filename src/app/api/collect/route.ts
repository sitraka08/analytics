import { MAX_BODY_BYTES, collectSchema } from "@/features/tracking/schemas/collect";
import { collectEvent } from "@/features/tracking/services/collect";
import { getClientIp } from "@/features/tracking/utils/client-ip";

// Public collection endpoint: always answers without a body.
function respond(status: number, allowOrigin?: string) {
  return new Response(null, {
    status,
    headers: allowOrigin ? { "Access-Control-Allow-Origin": allowOrigin, Vary: "Origin" } : undefined,
  });
}

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return respond(413);

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) return respond(413);

  let json: unknown;
  try {
    json = JSON.parse(body);
  } catch {
    return respond(400);
  }

  const payload = collectSchema.safeParse(json);
  if (!payload.success) return respond(400);

  try {
    const result = await collectEvent({
      payload: payload.data,
      origin: request.headers.get("origin"),
      ip: getClientIp(request.headers),
      userAgent: request.headers.get("user-agent"),
      country: parseCountry(request.headers.get("x-vercel-ip-country")),
      region: parseRegion(request.headers.get("x-vercel-ip-country-region")),
      city: parseCity(request.headers.get("x-vercel-ip-city")),
    });

    switch (result.status) {
      case "accepted":
        return respond(202, result.allowOrigin);
      case "ignored":
        return respond(202);
      case "forbidden":
        return respond(403);
      case "rate-limited":
        return respond(429);
    }
  } catch (error) {
    // Message only: the request itself carries personal data (IP, user-agent) that must not reach the logs.
    console.error("collect failed", error instanceof Error ? error.message : "unknown error");
    return respond(500);
  }
}

function parseCountry(value: string | null): string | null {
  return value && /^[A-Za-z]{2}$/.test(value) ? value.toUpperCase() : null;
}

function parseRegion(value: string | null): string | null {
  return value && /^[A-Za-z0-9-]{1,3}$/.test(value) ? value.toUpperCase() : null;
}

// Vercel sends the city URL-encoded ("S%C3%A3o%20Paulo").
function parseCity(value: string | null): string | null {
  if (!value) return null;
  try {
    const city = decodeURIComponent(value).trim();
    return city.length > 0 && city.length <= 100 ? city : null;
  } catch {
    return null;
  }
}
