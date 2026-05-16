import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { verifyAdmin } from "@/lib/auth-helpers";

export async function GET() {
  const check = await verifyAdmin();
  if (!check.success) {
    return NextResponse.json({ message: check.error!.message }, { status: check.error!.status });
  }

  const supabase = await createSupabaseServerClient();

  const { data: resources, error } = await supabase
    .from("resources")
    .select(`
      id,
      code,
      name,
      is_active,
      created_at,
      packages:package_resources(package_id, packages(title, base_price_idr))
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: "Gagal fetch resources." }, { status: 500 });
  }

  return NextResponse.json({ resources: resources || [] });
}

export async function POST(request: Request) {
  const check = await verifyAdmin();
  if (!check.success) {
    return NextResponse.json({ message: check.error!.message }, { status: check.error!.status });
  }

  const supabase = await createSupabaseServerClient();
  const body = await request.json();
  const { code, name, is_active = true } = body;

  if (!code || !name) {
    return NextResponse.json({ message: "Code dan name wajib diisi." }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("resources")
    .select("id")
    .eq("code", code.trim())
    .single();

  if (existing) {
    return NextResponse.json({ message: "Code sudah digunakan." }, { status: 409 });
  }

  const { data: resource, error: insertError } = await supabase
    .from("resources")
    .insert({ code: code.trim(), name, is_active })
    .select("id, code, name, is_active, created_at")
    .single();

  if (insertError) {
    return NextResponse.json({ message: "Gagal buat resource." }, { status: 500 });
  }

  return NextResponse.json({ resource }, { status: 201 });
}