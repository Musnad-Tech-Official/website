"use client";

import { useSession } from "@clerk/nextjs";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";
import { useMemo } from "react";
import { getSupabasePublicConfig } from "./config";

/**
 * Browser Supabase client using Clerk as the third-party auth provider.
 * The optional token form is kept for compatibility with existing call sites.
 */
export const createClient = (token?: string | null) => {
  const { url, publishableKey } = getSupabasePublicConfig();

  return createSupabaseClient<Database>(url, publishableKey, {
    accessToken: async () => token ?? null,
  });
};

/**
 * Returns a browser Supabase client that always resolves the active Clerk session token.
 */
export const useSupabaseClient = () => {
  const { session } = useSession();

  return useMemo(() => {
    const { url, publishableKey } = getSupabasePublicConfig();

    return createSupabaseClient<Database>(url, publishableKey, {
      accessToken: async () => (await session?.getToken()) ?? null,
    });
  }, [session]);
};
