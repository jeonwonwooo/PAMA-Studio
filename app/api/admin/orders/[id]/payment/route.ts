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
  const { action, payment_method, payment_note } = body;

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ message: "Action harus approve atau reject." }, { status: 400 });
  }

  if (!["cash", "transfer"].includes(payment_method)) {
    return NextResponse.json({ message: "Payment method tidak valid." }, { status: 400 });
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, status")
    .eq("id", id)
    .single();

  if (!order) {
    return NextResponse.json({ message: "Order tidak ditemukan." }, { status: 404 });
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (action === "approve") {
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_confirmed: true,
        payment_confirmed_at: new Date().toISOString(),
        payment_method,
        payment_note: payment_note || null,
        status: "paid",
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ message: "Gagal approve payment." }, { status: 500 });
    }
  } else {
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_confirmed: false,
        payment_confirmed_at: null,
        payment_method,
        payment_note: payment_note || null,
        status: "pending",
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ message: "Gagal reject payment." }, { status: 500 });
    }
  }

  if (user) {
    await supabase.from("order_events").insert({
      order_id: id,
      status: action === "approve" ? "paid" : "pending",
      message: action === "approve"
        ? `Payment disetujui. Metode: ${payment_method}. Catatan: ${payment_note || "-"}`
        : `Payment ditolak. Metode: ${payment_method}. Catatan: ${payment_note || "-"}`,
      created_by: user.id,
    });
  }

  const { data: updatedOrder } = await supabase
    .from("orders")
    .select("*, profiles:user_id(id, full_name, email), packages:package_id(id, title)")
    .eq("id", id)
    .single();

  return NextResponse.json({ order: updatedOrder, message: `Payment berhasil di${action === "approve" ? "setujui" : "tolak"}.` });
}