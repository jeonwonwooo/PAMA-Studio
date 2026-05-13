import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";

export async function GET() {
  const check = await verifyAdmin();
  if (!check.success) {
    return NextResponse.json({ message: check.error!.message }, { status: check.error!.status });
  }

const supabase = await createSupabaseServerClient();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    { count: totalUsers },
    { count: newUsers },
    { count: totalOrders },
    { count: completedOrders },
    { count: pendingOrders },
    { data: ordersRevenue },
    { data: pkgs },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", monthStart.toISOString()),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "done"),
    supabase.from("orders").select("id", { count: "exact", head: true }).in("status", ["pending", "awaiting_payment"]),
    supabase.from("orders").select("id, status, created_at, package_id, user_id, total_price_idr").gte("created_at", monthStart.toISOString()),
    supabase.from("packages").select("id, title, duration_minutes"),
  ]);

  const totalRevenue = (ordersRevenue ?? []).reduce((sum, o) => sum + (o.total_price_idr || 0), 0);

  const monthlyOrders = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    return (ordersRevenue ?? []).filter(o => {
      const orderDate = new Date(o.created_at);
      return orderDate >= dayStart && orderDate < dayEnd;
    }).length;
  });

  const prevMonthOrders = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    return (ordersRevenue ?? []).filter(o => {
      const orderDate = new Date(o.created_at);
      return orderDate >= dayStart && orderDate < dayEnd;
    }).length;
  });

  const packagePerformance = pkgs?.map(pkg => {
    const pkgOrders = (ordersRevenue ?? []).filter(o => o.package_id === pkg.id);
    const revenue = pkgOrders.reduce((sum, o) => sum + (o.total_price_idr || 0), 0);
    return {
      name: pkg.title || "Unknown",
      orders: pkgOrders.length,
      revenue,
      avgDuration: pkg.duration_minutes || 0,
    };
  }).sort((a, b) => b.orders - a.orders) ?? [];

  return NextResponse.json({
    stats: {
      totalUsers: totalUsers ?? 0,
      newUsers: newUsers ?? 0,
      totalOrders: totalOrders ?? 0,
      completedOrders: completedOrders ?? 0,
      pendingOrders: pendingOrders ?? 0,
      totalRevenue,
    },
    charts: {
      monthlyOrders,
      prevMonthlyOrders: prevMonthOrders,
    },
    packagePerformance,
  });
}
