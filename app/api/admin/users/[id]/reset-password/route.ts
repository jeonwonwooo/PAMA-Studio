import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { verifyAdmin } from "@/lib/auth-helpers";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await verifyAdmin();
  if (!check.success) {
    return NextResponse.json({ message: check.error!.message }, { status: check.error!.status });
  }

  const supabase = await createSupabaseServerClient();
  const { id } = await params;

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", id)
    .single();

  if (!profile?.email) {
    return NextResponse.json({ message: "User tidak ditemukan." }, { status: 404 });
  }

  const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-2) + "!";
  const { error: resetError } = await supabase.auth.admin.updateUserById(id, { password: tempPassword });

  if (resetError) {
    return NextResponse.json({ message: "Gagal reset password." }, { status: 500 });
  }

  return NextResponse.json({
    message: "Password berhasil direset.",
    tempPassword,
    note: "Berikan password sementara ini ke user.",
  });
}