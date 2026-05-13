"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const initializedRef = useRef(false);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, email, role, phone")
      .eq("id", userId)
      .single();
    return data as Profile | null;
  }, []); // Remove supabase from deps to prevent recreation

  const loadUser = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    try {
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
  }, [fetchProfile]); // Remove supabase from deps

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const syncSession = async () => {
      try {
        await supabase.auth.refreshSession();
      } catch {}
    };
    syncSession();

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
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        // Reload user data when token is refreshed (after login)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

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
