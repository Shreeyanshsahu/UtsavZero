
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type AppRole = "citizen" | "private_organizer" | "civic_demo_admin";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Verify and refresh the current authentication session.
  const {
    data,
    error: claimsError,
  } = await supabase.auth.getClaims();

  const userId = data?.claims?.sub;

  const pathname = request.nextUrl.pathname;

  // Identify protected routes.
  let requiredRole: AppRole | null = null;

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    requiredRole = "citizen";
  } else if (
    pathname === "/organizer" ||
    pathname.startsWith("/organizer/")
  ) {
    requiredRole = "private_organizer";
  } else if (
    pathname === "/civic" ||
    pathname.startsWith("/civic/")
  ) {
    requiredRole = "civic_demo_admin";
  }

  // Public pages do not require authentication.
  if (!requiredRole) {
    return supabaseResponse;
  }

  // Redirect unauthenticated users to login.
  if (claimsError || !userId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);

    const redirectResponse = NextResponse.redirect(loginUrl);

    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  // Retrieve roles from Supabase using the authenticated session.
  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  // Fail closed if role verification fails.
  if (roleError) {
    console.error("Route authorization error:", roleError);

    const redirectResponse = NextResponse.redirect(
      new URL("/", request.url)
    );

    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  const userRoles = (roleData ?? []).map(
    (item) => item.role as AppRole
  );

  // Redirect users who do not have the required role.
  if (!userRoles.includes(requiredRole)) {
    const redirectResponse = NextResponse.redirect(
      new URL("/dashboard", request.url)
    );

    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
