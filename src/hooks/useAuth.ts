"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { User as SupabaseUser, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser";
import {
  fetchProfileWithFallback,
  type AuthProfile,
} from "@/lib/auth-profile";

export type User = SupabaseUser;

export interface AuthState {
  user: User | null;
  profile: AuthProfile | null;
  loading: boolean;
  ready: boolean;
}

export type Profile = AuthProfile;

const supabase = createSupabaseBrowserClient();

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    ready: false,
  });

  const initializedRef = useRef(false);

  const setSessionState = useCallback(async (user: SupabaseUser | null) => {
    if (!user) {
      setAuthState({ user: null, profile: null, loading: false, ready: true });
      return;
    }
    const profile = await fetchProfileWithFallback(supabase, user);
    setAuthState({ user, profile, loading: false, ready: true });
  }, []);

  const loadUser = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await setSessionState(session?.user ?? null);
    } catch (error) {
      console.error("useAuth loadUser error:", error);
      setAuthState({ user: null, profile: null, loading: false, ready: true });
    }
  }, [setSessionState]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === "SIGNED_OUT") {
        setAuthState({ user: null, profile: null, loading: false, ready: true });
        return;
      }
      void setSessionState(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = useCallback(async () => {
    const [clientLogout, serverLogout] = await Promise.allSettled([
      supabase.auth.signOut(),
      fetch("/api/auth/logout", { method: "POST" }),
    ]);

    if (clientLogout.status === "rejected") {
      console.error("Client-side logout failed:", clientLogout.reason);
    }
    if (serverLogout.status === "rejected") {
      console.error("Server-side logout failed:", serverLogout.reason);
    }

    setAuthState({ user: null, profile: null, loading: false, ready: true });
  }, []);

  return {
    ...authState,
    logout,
    reload: loadUser,
  };
}