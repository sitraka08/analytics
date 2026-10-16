import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/db/server";
import { getSafeRedirectPath } from "@/features/auth";
import { ROUTES } from "@/lib/routes";

// Landing point of the links sent by Supabase Auth (Google sign-in, email confirmation, password recovery).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = getSafeRedirectPath(searchParams.get("next"), ROUTES.dashboard);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }

  return NextResponse.redirect(new URL(`${ROUTES.login}?error=callback`, origin));
}
