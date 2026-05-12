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

  // Get analytics data
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const { data: allOrders } = await supabase.from("orders").select("id, status, created_at, package_id, user_id, total_price_idr");
  const { count: totalUsers } = await supabase.from("profiles").select("id", { count: "exact", head: true });
  const { count: newUsers } = await supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", monthStart.toISOString());
  const { data: pkgs } = await supabase.from("packages").select("id, title, duration_minutes");

  // Calculate metrics
  const totalOrders = allOrders?.length ?? 0;
  const completedOrders = allOrders?.filter(o => o.status === "done").length ?? 0;
  const pendingOrders = allOrders?.filter(o => ["pending", "awaiting_payment"].includes(o.status)).length ?? 0;
  const totalRevenue = allOrders?.reduce((sum, o) => sum + (o.total_price_idr || 0), 0) ?? 0;

  // Monthly data for charts
  const monthlyOrders = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    return allOrders?.filter(o => {
      const orderDate = new Date(o.created_at);
      return orderDate >= dayStart && orderDate < dayEnd;
    }).length ?? 0;
  });

  const prevMonthlyOrders = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    return allOrders?.filter(o => {
      const orderDate = new Date(o.created_at);
      return orderDate >= dayStart && orderDate < dayEnd;
    }).length ?? 0;
  });

  // Package performance
  const packagePerformance = pkgs?.map(pkg => {
    const pkgOrders = allOrders?.filter(o => o.package_id === pkg.id) ?? [];
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
      totalOrders,
      completedOrders,
      pendingOrders,
      totalRevenue,
    },
    charts: {
      monthlyOrders,
      prevMonthlyOrders,
    },
    packagePerformance,
  });
}
