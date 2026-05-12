import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { success, remaining, resetAt } = rateLimit(ip);
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);

  if (!success) {
    return NextResponse.json(
      { message: "Terlalu banyak percobaan registrasi. Coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  try {
    const { name, email, password } = await request.json();
    const normalizedName = String(name ?? "").trim();
    const normalizedEmail = String(email ?? "").trim().toLowerCase();
    const normalizedPassword = String(password ?? "");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!normalizedName || normalizedName.length < 2) {
      return NextResponse.json(
        { message: "Nama minimal 2 karakter" },
        { status: 400 }
      );
    }

    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { message: "Format email tidak valid" },
        { status: 400 }
      );
    }

    if (!normalizedPassword || normalizedPassword.length < 6) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: normalizedPassword,
      options: {
        data: {
          full_name: normalizedName,
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { message: error.message || "Registrasi gagal" },
        { status: error.status || 400 }
      );
    }

    if (data.user?.id) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: normalizedName,
        email: normalizedEmail,
        role: "client",
      });

      if (profileError) {
        console.error("Failed to create profile after register:", profileError);
      }
    }

    return NextResponse.json({
      message: "Registrasi berhasil. Silakan login.",
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
