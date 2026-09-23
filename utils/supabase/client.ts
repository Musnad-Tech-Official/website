"use client";

import { useSession } from "@clerk/nextjs";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { useMemo } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Creates a standalone Supabase client for browser usage.
 * @param token Optional JWT token from Clerk
 */
export const createClient = (token?: string | null) => {
  return createSupabaseClient(supabaseUrl!, supabaseKey!, {
    accessToken: async () => token ?? null,
  });
};

/**
 * React hook for Client Components to get a Supabase client attached to the active Clerk session.
 */
export const useSupabaseClient = () => {
  const { session } = useSession();

  return useMemo(() => {
    return createSupabaseClient(supabaseUrl!, supabaseKey!, {
      accessToken: async () => {
        return (await session?.getToken()) ?? null;
      },
    });
  }, [session]);
};
