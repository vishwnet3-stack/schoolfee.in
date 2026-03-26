import { NextRequest, NextResponse } from "next/server";

// Routes that require specific roles
const ROLE_PREFIXES: Record<string, string> = {
  "/dashboard/admin/parent":  "parent",
  "/dashboard/admin/teacher": "teacher",
  "/dashboard/admin/school":  "school",
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only apply to admin dashboard routes (not login, not super-admin)
  if (!pathname.startsWith("/dashboard/admin") || pathname === "/dashboard/admin/login") {
    return NextResponse.next();
  }

  // Determine required role from path
  let requiredRole: string | null = null;
  for (const [prefix, role] of Object.entries(ROLE_PREFIXES)) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      requiredRole = role;
      break;
    }
  }

  if (!requiredRole) return NextResponse.next();

  // Read session cookie — if absent, redirect immediately (no DB call needed)
  const sessionToken = request.cookies.get("admin_user_session")?.value;
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/dashboard/admin/login", request.url));
  }

  // ── Fast path: trust the cookie is valid and let the page load ──────────
  // The AdminAuthProvider fetches /api/admin-auth/me once on mount and handles
  // role-based redirects on the client side. Removing the blocking HTTP
  // self-call here eliminates the 50s+ route-change latency.
  //
  // The DB session check still happens via the API route; it just runs in
  // parallel with page render rather than blocking it.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/admin/:path*"],
};
