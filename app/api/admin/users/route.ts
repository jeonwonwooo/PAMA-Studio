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
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";
  const offset = (page - 1) * limit;

  let query = supabase
    .from("profiles")
    .select("id, full_name, email, role, phone_whatsapp, instagram_handle, created_at", { count: "exact" });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }
  if (role) {
    query = query.eq("role", role);
  }

  const { data: profiles, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return NextResponse.json({
    users: profiles || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

export async function POST(request: Request) {
  const check = await verifyAdmin();
  if (!check.success) {
    return NextResponse.json({ message: check.error!.message }, { status: check.error!.status });
  }

  const supabase = await createSupabaseServerClient();
  const body = await request.json();
  const { email, password, full_name, role = "client", phone_whatsapp } = body;

  if (!email || !password || !full_name) {
    return NextResponse.json({ message: "Email, password, dan nama wajib diisi." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ message: "Password minimal 6 karakter." }, { status: 400 });
  }

  if (!["client", "admin"].includes(role)) {
    return NextResponse.json({ message: "Role tidak valid." }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email.toLowerCase())
    .single();

  if (existing) {
    return NextResponse.json({ message: "Email sudah terdaftar." }, { status: 409 });
  }

  const { data: authUser, error: signUpError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });

  if (signUpError || !authUser.user) {
    return NextResponse.json({ message: signUpError?.message || "Gagal membuat akun." }, { status: 400 });
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: authUser.user.id,
    full_name,
    email: email.toLowerCase(),
    role,
    phone_whatsapp: phone_whatsapp || null,
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(authUser.user.id);
    return NextResponse.json({ message: "Gagal membuat profil." }, { status: 500 });
  }

  return NextResponse.json({ user: authUser.user, message: "Akun berhasil dibuat." }, { status: 201 });
}