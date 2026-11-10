
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type AppRole =
  | "citizen"
  | "private_organizer"
  | "government_organizer"
  | "civic_demo_admin";

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

  // Verify the authentication session.
  const {
    data,
    error: claimsError,
  } = await supabase.auth.getClaims();

  const userId = data?.claims?.sub;
  const pathname = request.nextUrl.pathname;

  // Public routes do not require authentication.
  const isCivicRoute =
    pathname === "/civic" ||
    pathname.startsWith("/civic/");

  const isOrganizerRoute =
    pathname === "/organizer" ||
    pathname.startsWith("/organizer/");

  const isProfileRoute =
    pathname === "/profile" ||
    pathname.startsWith("/profile/");

  const isLegacyDashboardRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  if (
    !isCivicRoute &&
    !isOrganizerRoute &&
    !isProfileRoute &&
    !isLegacyDashboardRoute
  ) {
    return supabaseResponse;
  }

  // Require authentication.
  if (claimsError || !userId) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set(
      "next",
      pathname + request.nextUrl.search
    );

    const redirectResponse = NextResponse.redirect(loginUrl);

    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  // Fetch the authenticated user's roles.
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

  const isCivicAdmin =
  userRoles.includes("civic_demo_admin") ||
  userRoles.includes("government_organizer");

  const canHostEvents =
    userRoles.includes("private_organizer") ||
    userRoles.includes("government_organizer");

  const isCitizen = userRoles.includes("citizen");

  // Determine whether the user can access this route.
  let authorized = false;

  if (isCivicRoute) {
    authorized = isCivicAdmin;
  } else if (isOrganizerRoute) {
    authorized = canHostEvents;
  } else if (isProfileRoute || isLegacyDashboardRoute) {
    authorized = isCitizen;
  }

  if (!authorized) {
    // Redirect to the appropriate account destination.
    const destination = isCivicAdmin
      ? "/civic"
      : canHostEvents
      ? "/organizer"
      : isCitizen
      ? "/profile"
      : "/";

    const redirectResponse = NextResponse.redirect(
      new URL(destination, request.url)
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
