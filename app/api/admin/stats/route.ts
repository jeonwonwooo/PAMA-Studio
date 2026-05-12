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

  // Get stats
  const { count: totalUsers } = await supabase.from("profiles").select("id", { count: "exact", head: true });
  const { data: allOrders } = await supabase.from("orders").select("id, status, total_price_idr, package_id");
  const totalOrders = allOrders?.length ?? 0;
  const pendingOrders = allOrders?.filter(o => ["pending", "awaiting_payment"].includes(o.status)).length ?? 0;
  const doneOrders = allOrders?.filter(o => o.status === "done").length ?? 0;

  // Package stats
  const packageMap = new Map();
  for (const order of allOrders ?? []) {
    if (order.package_id) {
      const count = packageMap.get(order.package_id) || 0;
      packageMap.set(order.package_id, count + 1);
    }
  }

  const { data: packages } = await supabase.from("packages").select("id, title");
  const packageStats = packages?.map(pkg => ({
    id: pkg.id,
    title: pkg.title,
    count: packageMap.get(pkg.id) || 0,
    total: allOrders?.filter(o => o.package_id === pkg.id).reduce((sum, o) => sum + (o.total_price_idr || 0), 0) || 0,
  })) || [];

  return NextResponse.json({
    stats: { totalUsers: totalUsers ?? 0, totalOrders, pendingOrders, doneOrders },
    packageStats,
  });
}
