import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const [
    { count: totalOrders },
    { count: completedOrders },
    { count: totalPackages },
    { count: totalClients },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "done"),
    supabase.from("packages").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client"),
  ]);

  const stats = {
    totalOrders: totalOrders ?? 0,
    completedOrders: completedOrders ?? 0,
    totalPackages: totalPackages ?? 0,
    totalClients: totalClients ?? 0,
  };

  return NextResponse.json(stats);
}
