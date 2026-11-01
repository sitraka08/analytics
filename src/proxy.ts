import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/lib/routes";

// Keeps signed-out visitors out of the dashboard and sends signed-in users away from the sign-in/sign-up pages.
// Only the presence of the session cookie is checked here (cheap); `getSession()` validates it against the database.
// reset-password and verify-email are excluded on purpose: they work without a session.
const GUEST_ONLY_PATHS: string[] = [ROUTES.login, ROUTES.register, ROUTES.forgotPassword];

export function proxy(request: NextRequest) {
  const signedIn = Boolean(getSessionCookie(request));

  if (signedIn && GUEST_ONLY_PATHS.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  }

  if (!signedIn && request.nextUrl.pathname.startsWith(ROUTES.dashboard)) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password"],
};
