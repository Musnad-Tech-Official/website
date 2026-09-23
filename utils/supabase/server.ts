import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Creates a Supabase client configured with the current Clerk user session token
 * for server-side operations (Server Components, Server Actions, Route Handlers).
 */
export const createClient = async () => {
  const { getToken } = await auth();

  return createSupabaseClient(supabaseUrl!, supabaseKey!, {
    accessToken: async () => {
      return (await getToken()) ?? null;
    },
  });
};
