import { createSupabaseServerClient } from "./supabase/supabase-server";

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "client";
  full_name: string;
}

export interface AdminCheckResult {
  success: boolean;
  user: AdminUser | null;
  error?: { message: string; status: number };
}

export async function verifyAdmin(): Promise<AdminCheckResult> {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      user: null,
      error: { message: "Unauthorized", status: 401 },
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return {
      success: false,
      user: null,
      error: { message: "Forbidden", status: 403 },
    };
  }

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email ?? "",
      role: profile.role as "admin" | "client",
      full_name: profile.full_name ?? "",
    },
  };
}

export async function verifyAuth(): Promise<{ userId: string; email: string } | { userId: null; error: { message: string; status: number } }> {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      userId: null,
      error: { message: "Unauthorized", status: 401 },
    };
  }

  return { userId: user.id, email: user.email ?? "" };
}