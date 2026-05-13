import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";

const COOKIE_OPTIONS = {
  maxAge: 0,
  path: "/",
  sameSite: "lax" as const,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
    }

    // Clear cookies regardless of signOut result
    const response = NextResponse.json({ ok: true, message: "Logout berhasil" });
    response.cookies.set("sb-access-token", "", COOKIE_OPTIONS);
    response.cookies.set("sb-refresh-token", "", COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear cookies even if there's an error
    const response = NextResponse.json({ ok: true, message: "Logout berhasil" });
    response.cookies.set("sb-access-token", "", COOKIE_OPTIONS);
    response.cookies.set("sb-refresh-token", "", COOKIE_OPTIONS);
    return response;
  }
}
