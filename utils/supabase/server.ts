import "server-only";

import { auth } from "@clerk/nextjs/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";
import { getSupabasePublicConfig } from "./config";

/**
 * User-scoped server client. Requests carry the active Clerk session token and
 * remain subject to PostgreSQL grants and RLS.
 */
export const createClient = async () => {
  const { getToken } = await auth();
  const { url, publishableKey } = getSupabasePublicConfig();

  return createSupabaseClient<Database>(url, publishableKey, {
    accessToken: async () => (await getToken()) ?? null,
  });
};
