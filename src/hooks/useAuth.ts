"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser";

export interface Profile {
  full_name: string;
  email: string;
  role: "client" | "admin";
  phone?: string;
}

export interface User {
  id: string;
  email?: string;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  ready: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    ready: false,
  });

  const supabase = createSupabaseBrowserClient();

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, email, role, phone")
      .eq("id", userId)
      .single();
    return data as Profile | null;
  }, [supabase]);

  const loadUser = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    try {
      // First try getSession (checks cookies)
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session?.user) {
        const profile = await fetchProfile(sessionData.session.user.id);
        setAuthState({
          user: sessionData.session.user,
          profile,
          loading: false,
          ready: true,
        });
        return;
      }

      // Fallback to getUser (validates token with server)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAuthState({ user: null, profile: null, loading: false, ready: true });
        return;
      }

      const profile = await fetchProfile(user.id);
      setAuthState({ user, profile, loading: false, ready: true });
    } catch (error) {
      console.error("useAuth loadUser error:", error);
      setAuthState({ user: null, profile: null, loading: false, ready: true });
    }
  }, [supabase, fetchProfile]);

  useEffect(() => {
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const profile = await fetchProfile(session.user.id);
        setAuthState({
          user: session.user,
          profile,
          loading: false,
          ready: true,
        });
      } else if (event === "SIGNED_OUT") {
        setAuthState({ user: null, profile: null, loading: false, ready: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, loadUser, fetchProfile]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthState({ user: null, profile: null, loading: false, ready: true });
  }, []);

  return {
    ...authState,
    logout,
    reload: loadUser,
  };
}
