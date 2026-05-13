import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard-client", "/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();

  // Cek cookie Supabase SSR — formatnya sb-<project-ref>-auth-token
  const allCookies = request.cookies.getAll();
  const authCookie = allCookies.find(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );

  if (!authCookie?.value) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Validasi value-nya bukan string kosong atau invalid
  try {
    const parsed = JSON.parse(authCookie.value);
    if (!parsed?.access_token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard-client/:path*", "/admin/:path*"],
};