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

  // Read session cookie
  const sessionToken = request.cookies.get("admin_user_session")?.value;
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/dashboard/admin/login", request.url));
  }

  // Validate session via internal API (lightweight DB check)
  try {
    const meRes = await fetch(new URL("/api/admin-auth/me", request.url), {
      headers: { cookie: `admin_user_session=${sessionToken}` },
      cache: "no-store",
    });

    if (!meRes.ok) {
      return NextResponse.redirect(new URL("/dashboard/admin/login", request.url));
    }

    const data = await meRes.json();
    if (!data.success || !data.user) {
      return NextResponse.redirect(new URL("/dashboard/admin/login", request.url));
    }

    const userRole = data.user.role;

    // If trying to access wrong role's pages — redirect to their own home
    if (userRole !== requiredRole) {
      const roleHomes: Record<string, string> = {
        parent:  "/dashboard/admin/parent",
        teacher: "/dashboard/admin/teacher",
        school:  "/dashboard/admin/school",
      };
      return NextResponse.redirect(new URL(roleHomes[userRole] || "/dashboard/admin/login", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/dashboard/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/admin/:path*"],
};