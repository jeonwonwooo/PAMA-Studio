import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import {
  createFallbackProfile,
  fetchProfileByUserId,
} from "@/lib/auth-profile";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

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

    const profile =
      (await fetchProfileByUserId(supabase, data.user.id)) ??
      createFallbackProfile(data.user);

    return NextResponse.json({
      message: "Login berhasil",
      user: data.user,
      profile,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
