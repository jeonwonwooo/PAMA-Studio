import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("name, role, avatar_url, text, rating")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Testimonials fetch error:", error.message);
    return NextResponse.json({ testimonials: [] });
  }

  return NextResponse.json({ testimonials: testimonials || [] });
}
