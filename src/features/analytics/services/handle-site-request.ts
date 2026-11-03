import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/features/auth";
import { SiteNotFoundError } from "@/features/sites";
import { SessionNotFoundError } from "./sessions";

type SiteRouteContext = {
  params: Promise<Record<string, string | string[] | undefined>>;
};

type SiteRequest = {
  userId: string;
  siteId: string;
  searchParams: URLSearchParams;
  params: Record<string, string | string[] | undefined>;
};

const siteIdSchema = z.uuid();

/**
 * Shared shell of the dashboard read endpoints: session (401), site id validation (400), then the handler.
 * Invalid route parameters (a thrown `ZodError`) answer 400. A site the user does not own, or a missing visit, answers 404 like a missing one. Nothing cached: data is per user.
 */
export async function handleSiteRequest(
  request: NextRequest,
  context: SiteRouteContext,
  run: (input: SiteRequest) => Promise<unknown>,
) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const params = await context.params;
  const siteId = siteIdSchema.safeParse(params.siteId);
  if (!siteId.success)
    return NextResponse.json({ error: "invalid-site" }, { status: 400 });

  try {
    const data = await run({
      userId: session.user.id,
      siteId: siteId.data,
      searchParams: request.nextUrl.searchParams,
      params,
    });
    return NextResponse.json(data, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    if (error instanceof z.ZodError)
      return NextResponse.json({ error: "invalid-request" }, { status: 400 });
    if (
      error instanceof SiteNotFoundError ||
      error instanceof SessionNotFoundError
    ) {
      return NextResponse.json({ error: "not-found" }, { status: 404 });
    }
    console.error(
      "analytics request failed",
      error instanceof Error ? error.message : "unknown error",
    );
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
}
