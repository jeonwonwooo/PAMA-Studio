import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard-client", "/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();

  const allCookies = request.cookies.getAll();
  const authCookie = allCookies.find(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );

  if (!authCookie?.value || authCookie.value.length < 10) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const parsed = JSON.parse(authCookie.value);
    if (!parsed?.access_token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    // not JSON — might be a token string, allow through
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard-client/:path*", "/admin/:path*"],
};