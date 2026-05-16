import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { verifyAdmin } from "@/lib/auth-helpers";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await verifyAdmin();
  if (!check.success) {
    return NextResponse.json({ message: check.error!.message }, { status: check.error!.status });
  }

  const supabase = await createSupabaseServerClient();
  const { id } = await params;
  const body = await request.json();
  const { code, name, is_active } = body;

  if (code !== undefined) {
    const { data: existing } = await supabase
      .from("resources")
      .select("id")
      .eq("code", code.trim())
      .neq("id", id)
      .single();

    if (existing) {
      return NextResponse.json({ message: "Code sudah digunakan resource lain." }, { status: 409 });
    }
  }

  const updateData: Record<string, any> = {};
  if (code !== undefined) updateData.code = code.trim();
  if (name !== undefined) updateData.name = name;
  if (is_active !== undefined) updateData.is_active = is_active;

  const { error: updateError } = await supabase
    .from("resources")
    .update(updateData)
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ message: "Gagal update resource." }, { status: 500 });
  }

  const { data: resource } = await supabase
    .from("resources")
    .select("id, code, name, is_active, created_at")
    .eq("id", id)
    .single();

  return NextResponse.json({ resource });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await verifyAdmin();
  if (!check.success) {
    return NextResponse.json({ message: check.error!.message }, { status: check.error!.status });
  }

  const supabase = await createSupabaseServerClient();
  const { id } = await params;

  const { data: linked } = await supabase
    .from("package_resources")
    .select("package_id")
    .eq("resource_id", id);

  if (linked && linked.length > 0) {
    return NextResponse.json({ message: "Resource masih terhubung ke paket. Lepas dulu dari paket terkait." }, { status: 409 });
  }

  const { error: deleteError } = await supabase
    .from("resources")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ message: "Gagal hapus resource." }, { status: 500 });
  }

  return NextResponse.json({ message: "Resource berhasil dihapus." });
}