import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../src/lib/supabase/supabase-server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Failed to load profile:", profileError);
  }

  return NextResponse.json({ user, profile });
}
