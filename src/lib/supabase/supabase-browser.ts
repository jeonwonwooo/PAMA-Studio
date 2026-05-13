import { createBrowserClient } from "@supabase/ssr";

const globalForSupabase = globalThis as typeof globalThis & {
  __pamaSupabaseBrowserClient?: ReturnType<typeof createBrowserClient>;
};

export function createSupabaseBrowserClient() {
  if (!globalForSupabase.__pamaSupabaseBrowserClient) {
    globalForSupabase.__pamaSupabaseBrowserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return globalForSupabase.__pamaSupabaseBrowserClient;
}
