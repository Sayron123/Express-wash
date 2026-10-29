import "server-only";
import { createClient } from "@supabase/supabase-js";

// Both clients run on the server only. Env vars are read inside the functions so a missing
// value fails the request that needs it, not the whole build.

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

/** Anon key: bound by RLS, which only allows inserting a pending pickup. Used by /book. */
export function anonClient() {
  return createClient(env("NEXT_PUBLIC_SUPABASE_URL"), env("NEXT_PUBLIC_SUPABASE_ANON_KEY"), {
    auth: { persistSession: false },
  });
}

/** Service role: bypasses RLS. Only call after the admin cookie has been verified. */
export function serviceClient() {
  return createClient(env("NEXT_PUBLIC_SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });
}
