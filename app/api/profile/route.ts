import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import {
  createFallbackProfile,
  fetchProfileByUserId,
} from "@/lib/auth-profile";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const profile =
    (await fetchProfileByUserId(supabase, user.id)) ??
    createFallbackProfile(user);

  return NextResponse.json({ user, profile });
}
