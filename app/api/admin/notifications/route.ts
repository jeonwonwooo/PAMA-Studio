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

  // Get notifications data
  const since24h = new Date(Date.now() - 24 * 3600000).toISOString();
  const since48h = new Date(Date.now() - 48 * 3600000).toISOString();

  // New orders
  const { data: newOrders } = await supabase
    .from("orders")
    .select("id, created_at, profiles(full_name), packages(title)")
    .gte("created_at", since24h)
    .order("created_at", { ascending: false });

  // Long pending orders
  const { data: longPending } = await supabase
    .from("orders")
    .select("id, created_at, profiles(full_name), packages(title)")
    .eq("status", "pending")
    .lt("created_at", since48h)
    .order("created_at", { ascending: true });

  const notifications = [
    ...(newOrders?.map(order => ({
      id: `new-${order.id}`,
      type: "new_order" as const,
      title: "Pesanan Baru Masuk",
      desc: `${(order.profiles as any)?.full_name ?? "Customer"} memesan ${(order.packages as any)?.title ?? "paket"}`,
      time: order.created_at,
      read: false,
    })) || []),
    ...(longPending?.map(order => ({
      id: `pending-${order.id}`,
      type: "long_pending" as const,
      title: "Pesanan Pending Lama",
      desc: `Pesanan ${(order.profiles as any)?.full_name ?? "Customer"} belum diproses selama >48 jam`,
      time: order.created_at,
      read: false,
    })) || []),
  ];

  return NextResponse.json({ notifications });
}
