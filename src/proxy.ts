import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the Supabase auth cookie on each page request.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(list) {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    await supabase.auth.getUser();
  } catch (e) {
    // A misconfigured or unreachable auth backend must not take the whole site down.
    console.error("proxy: session refresh failed", e instanceof Error ? e.message : e);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api/stripe/webhook|api/health|_next/static|_next/image|favicon.ico).*)"],
};
