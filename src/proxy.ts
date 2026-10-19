import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/db/types";
import { ROUTES } from "@/lib/routes";

// Refreshes the Supabase session cookies, keeps signed-out visitors out of the dashboard
// and sends signed-in users away from the sign-in/sign-up pages.
// reset-password and verify-email are excluded on purpose: they work with a session or a pending one.
const GUEST_ONLY_PATHS: string[] = [ROUTES.login, ROUTES.register, ROUTES.forgotPassword];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
      },
    },
  });

  const { data } = await supabase.auth.getUser();

  if (data.user && GUEST_ONLY_PATHS.includes(request.nextUrl.pathname)) {
    const redirect = NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    return redirect;
  }

  if (!data.user && request.nextUrl.pathname.startsWith(ROUTES.dashboard)) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password"],
};
