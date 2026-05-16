import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { verifyAdmin } from "@/lib/auth-helpers";

export async function GET(request: Request) {
  const check = await verifyAdmin();
  if (!check.success) {
    return NextResponse.json({ message: check.error!.message }, { status: check.error!.status });
  }

  const supabase = await createSupabaseServerClient();
  const { searchParams } = new URL(request.url);
  const resourceId = searchParams.get("resourceId");
  const date = searchParams.get("date");

  let query = supabase
    .from("booking_slots")
    .select(`
      id,
      resource_id,
      start_at,
      end_at,
      is_active,
      created_at,
      resources:resource_id(id, code, name)
    `)
    .order("start_at", { ascending: true });

  if (resourceId) {
    query = query.eq("resource_id", resourceId);
  }

  if (date) {
    const dayStart = new Date(date + "T00:00:00+07:00").toISOString();
    const dayEnd = new Date(date + "T23:59:59+07:00").toISOString();
    query = query.gte("start_at", dayStart).lte("start_at", dayEnd);
  }

  const { data: slots, error } = await query;

  if (error) {
    return NextResponse.json({ message: "Gagal fetch slots." }, { status: 500 });
  }

  const { data: resources } = await supabase
    .from("resources")
    .select("id, code, name, is_active")
    .order("name");

  return NextResponse.json({ slots: slots || [], resources: resources || [] });
}

export async function POST(request: Request) {
  const check = await verifyAdmin();
  if (!check.success) {
    return NextResponse.json({ message: check.error!.message }, { status: check.error!.status });
  }

  const supabase = await createSupabaseServerClient();
  const body = await request.json();
  const { resource_id, start_at, end_at } = body;

  if (!resource_id || !start_at || !end_at) {
    return NextResponse.json({ message: "Resource, start_at, dan end_at wajib diisi." }, { status: 400 });
  }

  const { data: resource } = await supabase
    .from("resources")
    .select("id")
    .eq("id", resource_id)
    .single();

  if (!resource) {
    return NextResponse.json({ message: "Resource tidak ditemukan." }, { status: 404 });
  }

  const { data: slot, error: insertError } = await supabase
    .from("booking_slots")
    .insert({
      resource_id,
      start_at: new Date(start_at).toISOString(),
      end_at: new Date(end_at).toISOString(),
    })
    .select(`
      id,
      resource_id,
      start_at,
      end_at,
      is_active,
      created_at,
      resources:resource_id(id, code, name)
    `)
    .single();

  if (insertError) {
    return NextResponse.json({ message: "Gagal buat slot. " + insertError.message }, { status: 500 });
  }

  return NextResponse.json({ slot }, { status: 201 });
}