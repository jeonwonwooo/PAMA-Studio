import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { verifyAdmin } from "@/lib/auth-helpers";

export async function GET() {
  const check = await verifyAdmin();
  if (!check.success) {
    return NextResponse.json({ message: check.error!.message }, { status: check.error!.status });
  }

  const supabase = await createSupabaseServerClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    { count: totalUsers },
    { count: totalOrders },
    { data: pendingData },
    { data: doneData },
    { data: allPkgStats },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id, package_id, total_price_idr").in("status", ["pending", "awaiting_payment"]),
    supabase.from("orders").select("id, package_id, total_price_idr").eq("status", "done"),
    supabase.from("orders")
      .select("package_id, total_price_idr")
      .gte("created_at", startOfMonth),
  ]);

  const pendingOrders = pendingData?.length ?? 0;
  const doneOrders = doneData?.length ?? 0;

  const packageMap = new Map<string, { count: number; total: number }>();
  for (const o of allPkgStats ?? []) {
    if (o.package_id) {
      const existing = packageMap.get(o.package_id) ?? { count: 0, total: 0 };
      existing.count += 1;
      existing.total += o.total_price_idr ?? 0;
      packageMap.set(o.package_id, existing);
    }
  }

  const { data: packages } = await supabase.from("packages").select("id, title");
  const packageStats = packages?.map(pkg => ({
    id: pkg.id,
    title: pkg.title,
    count: packageMap.get(pkg.id)?.count ?? 0,
    total: packageMap.get(pkg.id)?.total ?? 0,
  })) || [];

  return NextResponse.json({
    stats: { totalUsers: totalUsers ?? 0, totalOrders: totalOrders ?? 0, pendingOrders, doneOrders },
    packageStats,
  });
}
