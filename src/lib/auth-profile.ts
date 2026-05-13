import type { SupabaseClient, User } from "@supabase/supabase-js";

export interface AuthProfile {
  full_name: string;
  email: string;
  role: "client" | "admin";
  phone?: string;
}

interface RawProfileRow {
  full_name: string | null;
  email: string | null;
  role: string | null;
  phone?: string | null;
  phone_whatsapp?: string | null;
}

export function normalizeProfile(profile: RawProfileRow | null | undefined): AuthProfile | null {
  if (!profile) {
    return null;
  }

  return {
    full_name: profile.full_name ?? "",
    email: profile.email ?? "",
    role: profile.role === "admin" ? "admin" : "client",
    phone: profile.phone_whatsapp ?? profile.phone ?? undefined,
  };
}

export function createFallbackProfile(user: User): AuthProfile {
  return {
    full_name: getFallbackName(user.user_metadata?.full_name, user.email),
    email: user.email ?? "",
    role: "client",
  };
}

export function createFallbackProfileFromValues(email?: string, fullName?: string): AuthProfile {
  return {
    full_name: getFallbackName(fullName, email),
    email: email ?? "",
    role: "client",
  };
}

export async function fetchProfileByUserId(
  supabase: SupabaseClient,
  userId: string
): Promise<AuthProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, email, role, phone_whatsapp")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }

  return normalizeProfile(data);
}

function getFallbackName(fullName?: string | null, email?: string | null) {
  return fullName?.trim() || email?.split("@")[0] || "Pelanggan PAMA";
}
