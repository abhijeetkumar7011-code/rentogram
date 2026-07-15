// ⚠️ SERVER-ONLY. Never import this file from a "use client" component —
// it uses the Supabase service_role key, which bypasses Row Level Security
// entirely. It must only ever run in server contexts (API routes, Server
// Components, Server Actions), where the key is never sent to the browser.
//
// Add this to your environment variables (Vercel: Project Settings →
// Environment Variables; local: .env.local) — NOT prefixed with NEXT_PUBLIC_:
//   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
// Find it in Supabase Dashboard → Project Settings → API → service_role.

import { createClient } from "@supabase/supabase-js";

let cachedClient = null;

/**
 * Lazily creates (and caches) the admin client on first use. This is
 * intentionally NOT created at module load time — if it were, a missing
 * SUPABASE_SERVICE_ROLE_KEY would crash the entire Next.js build/deploy
 * (Next tries to statically evaluate every API route during build), instead
 * of just failing the one request that actually needs it.
 */
export function getSupabaseAdmin() {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client isn't configured — set SUPABASE_SERVICE_ROLE_KEY " +
        "(and NEXT_PUBLIC_SUPABASE_URL) in your environment variables."
    );
  }

  cachedClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}