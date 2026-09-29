import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";
import { getSupabasePublicConfig } from "./config";

/**
 * Server-only privileged client.
 *
 * Use only for explicitly approved flows that must not run as an end-user:
 * verified webhooks, background jobs, anonymous server-validated writes, and
 * infrastructure/admin operations that cannot be represented safely by user RLS.
 */
export const createPrivilegedClient = () => {
  const { url } = getSupabasePublicConfig();
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing SUPABASE_SECRET_KEY");
  }

  return createSupabaseClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
};
