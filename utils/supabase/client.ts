"use client";

import { GetToken } from "@clerk/nextjs/types";
import { createClient} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;


export const createSupabaseClient = (token?: GetToken | null) => {
  return createClient(supabaseUrl!, supabaseKey!, {
    accessToken: async () => await token?.() ?? null,
  });
};



