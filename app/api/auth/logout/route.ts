import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  
  // Refresh session first to get latest cookies
  await supabase.auth.refreshSession();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Logout berhasil" });
}
