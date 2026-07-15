// ⚠️ SERVER-ONLY. Never import this file from a "use client" component —
// it uses the Supabase service_role key, which bypasses Row Level Security
// entirely. It must only ever run in server contexts (API routes, Server
// Components, Server Actions), where the key is never sent to the browser.
//
// Add this to your .env.local (NOT prefixed with NEXT_PUBLIC_):
//   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
// You can find it in Supabase Dashboard → Project Settings → API → service_role.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey && typeof window === "undefined") {
  console.warn(
    "[supabaseAdmin] SUPABASE_SERVICE_ROLE_KEY is not set — admin-only operations (image upload, product CRUD) will fail."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});