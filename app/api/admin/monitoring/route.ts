import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";

export async function GET() {
  const check = await verifyAdmin();
  if (!check.success) {
    return NextResponse.json({ message: check.error!.message }, { status: check.error!.status });
  }

  const supabase = await createSupabaseServerClient();
  const { count: totalUsers } = await supabase.from("profiles").select("id", { count: "exact", head: true });
  const { count: totalOrders } = await supabase.from("orders").select("id", { count: "exact", head: true });
  const { data: recentOrders } = await supabase.from("orders").select("id, created_at").order("created_at", { ascending: false }).limit(10);

  // Mock system metrics (in real app, would get from actual monitoring)
  const monitoringData = {
    systemStatus: [
      { label: "Database", status: "Online", icon: "Database" },
      { label: "API Server", status: "Online", icon: "Server" },
      { label: "Authentication", status: "Active", icon: "Users" },
      { label: "Email Service", status: "Connected", icon: "Mail" },
      { label: "Payment Gateway", status: "Stable", icon: "CreditCard" },
      { label: "Storage", status: "Online", icon: "HardDrive" },
    ],
    performance: {
      usersOnline: Math.floor(Math.random() * 50) + 10, // Mock
      responseTime: `${Math.floor(Math.random() * 200) + 50}ms`,
      requestsToday: totalOrders || 0,
      cpuUsage: Math.floor(Math.random() * 30) + 20,
    },
    storage: {
      used: (totalOrders || 0) * 1000000, // Mock calculation
      total: 12 * 1e12,
    },
    activityLogs: recentOrders?.map(order => ({
      time: new Date(order.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      message: `Order ${order.id.slice(-8)} created`,
      type: "info" as const,
    })) || [],
    errorLogs: [], // Empty for now
  };

  return NextResponse.json(monitoringData);
}
