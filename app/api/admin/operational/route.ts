import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  // Get operational data
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      created_at,
      scheduled_at,
      total_price_idr,
      packages(title),
      profiles(full_name, phone)
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (ordersError) {
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }

  return NextResponse.json({ orders: orders || [] });
}

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { orderId, status } = await request.json();

  if (!orderId || !status) {
    return NextResponse.json({ message: "Missing orderId or status" }, { status: 400 });
  }

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    return NextResponse.json({ message: "Failed to update order status" }, { status: 500 });
  }

  return NextResponse.json({ message: "Status updated successfully" });
}
