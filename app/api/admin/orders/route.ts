import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";

export async function GET() {
  const check = await verifyAdmin();
  if (!check.success) {
    return NextResponse.json({ message: check.error!.message }, { status: check.error!.status });
  }

  const supabase = await createSupabaseServerClient();
  const { data: recentOrders, error } = await supabase
    .from("orders")
    .select("id, status, total_price_idr, created_at, scheduled_at, packages(title), profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: recentOrders || [] });
}
