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
  const { full_name, role, phone_whatsapp, instagram_handle, banned } = body;

  if (role && !["client", "admin"].includes(role)) {
    return NextResponse.json({ message: "Role tidak valid." }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("id", id)
    .single();

  if (!profile) {
    return NextResponse.json({ message: "User tidak ditemukan." }, { status: 404 });
  }

  const updateData: Record<string, any> = {};
  if (full_name !== undefined) updateData.full_name = full_name;
  if (role !== undefined) updateData.role = role;
  if (phone_whatsapp !== undefined) updateData.phone_whatsapp = phone_whatsapp;
  if (instagram_handle !== undefined) updateData.instagram_handle = instagram_handle;

  if (Object.keys(updateData).length > 0) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", id);

    if (profileError) {
      return NextResponse.json({ message: "Gagal update profil." }, { status: 500 });
    }
  }

  if (banned !== undefined) {
    const { error: banError } = await supabase.auth.admin.updateUserById(id, {
      ban_duration: banned ? "999999 seconds" : "none",
    });

    if (banError) {
      return NextResponse.json({ message: "Gagal update status banned." }, { status: 500 });
    }
  }

  const { data: updatedProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  return NextResponse.json({ profile: updatedProfile, message: "User berhasil diupdate." });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await verifyAdmin();
  if (!check.success) {
    return NextResponse.json({ message: check.error!.message }, { status: check.error!.status });
  }

  const supabase = await createSupabaseServerClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (id === user?.id) {
    return NextResponse.json({ message: "Tidak bisa hapus akun sendiri." }, { status: 400 });
  }

  const { error: deleteError } = await supabase.auth.admin.deleteUser(id);

  if (deleteError) {
    return NextResponse.json({ message: "Gagal hapus user." }, { status: 500 });
  }

  return NextResponse.json({ message: "User berhasil dihapus." });
}