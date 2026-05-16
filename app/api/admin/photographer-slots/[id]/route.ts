import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { verifyAdmin } from "@/lib/auth-helpers";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const check = await verifyAdmin();
  if (!check.success) {
    return NextResponse.json({ message: check.error!.message }, { status: check.error!.status });
  }

  const supabase = await createSupabaseServerClient();
  const { id } = await params;

  const { data: booking } = await supabase
    .from("bookings")
    .select("id")
    .eq("slot_id", id)
    .single();

  if (booking) {
    return NextResponse.json({ message: "Slot sudah dibooking. Batalkan booking dulu." }, { status: 409 });
  }

  const { error: deleteError } = await supabase
    .from("booking_slots")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ message: "Gagal hapus slot." }, { status: 500 });
  }

  return NextResponse.json({ message: "Slot berhasil dihapus." });
}