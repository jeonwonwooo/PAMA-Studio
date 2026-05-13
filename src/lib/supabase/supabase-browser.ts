import { createBrowserClient } from "@supabase/ssr";

const globalForSupabase = globalThis as typeof globalThis & {
  __supabaseBrowserClientSingleton?: ReturnType<typeof createBrowserClient>;
};

export function createSupabaseBrowserClient() {
  if (!globalForSupabase.__supabaseBrowserClientSingleton) {
    globalForSupabase.__supabaseBrowserClientSingleton = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return globalForSupabase.__supabaseBrowserClientSingleton;
}
