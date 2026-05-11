import { createSupabaseServerClient } from "./supabase/supabase-server";
import { startOfDay, startOfWeek, startOfMonth, endOfDay, format } from "date-fns";

export type AnalyticsRange = "daily" | "weekly" | "monthly";

export interface AnalyticsData {
  range: AnalyticsRange;
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  pendingOrders: number;
  popularPackages: { title: string; count: number }[];
  recentOrders: { id: string; total_price_idr: number; created_at: string; status: string }[];
  dateRange: { start: string; end: string };
}

export async function getAnalyticsData(range: AnalyticsRange): Promise<AnalyticsData> {
  const supabase = await createSupabaseServerClient();

  // Use Asia/Jakarta (WIB) - UTC+7
  const now = new Date();
  const jakartaOffset = 7 * 60 * 60 * 1000;
  const nowWIB = new Date(now.getTime() + jakartaOffset);

  let startDate: Date;
  // We calculate boundaries in UTC but adjusted for Jakarta
  if (range === "daily") {
    startDate = startOfDay(nowWIB);
  } else if (range === "weekly") {
    startDate = startOfWeek(nowWIB, { weekStartsOn: 1 });
  } else {
    startDate = startOfMonth(nowWIB);
  }

  // Adjust back to UTC for Supabase query
  const startISO = new Date(startDate.getTime() - jakartaOffset).toISOString();
  const endISO = now.toISOString();

  console.log(`[Analytics] Querying orders from ${startISO} to ${endISO}`);

  // 1. Fetch orders in range
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*, packages(title)")
    .gte("created_at", startISO)
    .lte("created_at", endISO);

  if (ordersError) {
    console.error("[Analytics] Supabase Error:", ordersError);
    throw new Error(`Database error: ${ordersError.message}`);
  }

  const safeOrders = orders || [];
  const totalOrders = safeOrders.length;
  const completedOrders = safeOrders.filter(o => o.status === "done");
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total_price_idr || 0), 0);
  const pendingOrdersCount = safeOrders.filter(o => ["pending", "awaiting_payment"].includes(o.status)).length;

  // 2. Popular packages
  const packageStats: Record<string, number> = {};
  safeOrders.forEach(o => {
    const title = o.packages?.title || "Unknown Package";
    packageStats[title] = (packageStats[title] || 0) + 1;
  });

  const popularPackages = Object.entries(packageStats)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 3. Recent orders
  const recentOrders = [...safeOrders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map(o => ({
      id: o.id,
      total_price_idr: o.total_price_idr,
      created_at: o.created_at,
      status: o.status
    }));

  return {
    range,
    totalOrders,
    totalRevenue,
    completedOrders: completedOrders.length,
    pendingOrders: pendingOrdersCount,
    popularPackages,
    recentOrders,
    dateRange: {
      start: format(startDate, "PPP"),
      end: format(nowWIB, "PPP") // Show WIB end time
    }
  };
}
