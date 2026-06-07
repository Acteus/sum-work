import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/proxy";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/utils/supabase/env";

const AUTH_ROUTES = new Set(["/login", "/register"]);

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (AUTH_ROUTES.has(pathname)) {
    const { url, publishableKey } = getSupabaseEnv();
    const supabase = createServerClient(url, publishableKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    });
    const { data } = await supabase.auth.getClaims();
    if (data?.claims) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
