import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
  sameSite: "lax" as const,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { success, resetAt } = rateLimit(ip);
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);

  if (!success) {
    return NextResponse.json(
      { message: "Terlalu banyak percobaan login. Coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const email = body?.email;
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPassword = String(password);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { message: "Format email tidak valid" },
        { status: 400 }
      );
    }

    if (normalizedPassword.length < 6) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: normalizedPassword,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { message: error?.message || "Email atau password salah" },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("Failed to load profile after login:", profileError);
    }

    const response = NextResponse.json({
      message: "Login berhasil",
      user: data.user,
      profile,
    });

    if (data.session) {
      response.cookies.set("sb-access-token", data.session.access_token, COOKIE_OPTIONS);
      response.cookies.set("sb-refresh-token", data.session.refresh_token, COOKIE_OPTIONS);
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
