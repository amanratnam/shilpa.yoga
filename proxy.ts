import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, decodeSession } from "@/lib/admin/session";

/**
 * Optimistic auth gate for the admin panel (Next 16 renamed Middleware to
 * Proxy). This only reads the signed cookie — the authoritative check lives in
 * `verifySession()`, which every admin page and Server Action calls.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  const session = await decodeSession(request.cookies.get(SESSION_COOKIE)?.value);

  // Note: signed-in visitors are deliberately NOT bounced off /admin/login.
  // Doing so made the login page unreachable and left no way to switch user.
  if (!session && !isLoginRoute) {
    const url = new URL("/admin/login", request.url);
    // Remember where they were headed, so login can send them back.
    if (pathname !== "/admin") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
