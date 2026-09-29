import "server-only";

import { createPrivilegedClient } from "@/utils/supabase/privileged";
import { createClient as createUserServerClient } from "@/utils/supabase/server";
import { AppError } from "@/lib/backend/shared/errors";
import type { Database } from "@/types/database.types";
import { z } from "zod";
import type { ClerkProfileSyncInput, Profile } from "./types";

const PROFILE_SELECT =
  "id, clerk_user_id, primary_email, display_name, avatar_url, preferred_locale, status, created_at, updated_at, deleted_at";

type ProfileRow = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  | "id"
  | "clerk_user_id"
  | "primary_email"
  | "display_name"
  | "avatar_url"
  | "preferred_locale"
  | "status"
  | "created_at"
  | "updated_at"
  | "deleted_at"
>;

const profileStatusSchema = z.enum(["active", "suspended", "deleted"]);
const supportedLocaleSchema = z.enum(["en", "ar"]);

const mapProfile = (row: ProfileRow): Profile => ({
  id: row.id,
  clerkUserId: row.clerk_user_id,
  primaryEmail: row.primary_email,
  displayName: row.display_name,
  avatarUrl: row.avatar_url,
  preferredLocale: supportedLocaleSchema.parse(row.preferred_locale),
  status: profileStatusSchema.parse(row.status),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  deletedAt: row.deleted_at,
});

const persistenceError = (message: string, cause: unknown) =>
  new AppError("PERSISTENCE_FAILED", message, { cause });

/**
 * Ensures an internal identity row exists without depending on eventual webhook delivery.
 * This intentionally does not reactivate an existing deleted/suspended profile.
 */
export const ensureProfileExists = async (clerkUserId: string): Promise<void> => {
  const supabase = createPrivilegedClient();

  const { error } = await supabase.from("profiles").upsert(
    {
      clerk_user_id: clerkUserId,
      status: "active",
    },
    {
      onConflict: "clerk_user_id",
      ignoreDuplicates: true,
    },
  );

  if (error) {
    throw persistenceError("Could not ensure profile", error);
  }
};

/**
 * Applies Clerk create/update data without allowing stale webhook deliveries to
 * overwrite newer data and without resurrecting a deleted profile.
 */
export const syncProfileFromClerk = async (input: ClerkProfileSyncInput): Promise<void> => {
  const supabase = createPrivilegedClient();

  const { error } = await supabase.rpc("sync_clerk_profile", {
    p_clerk_user_id: input.clerkUserId,
    p_event_timestamp: input.eventTimestamp,
    p_primary_email: input.primaryEmail ?? undefined,
    p_display_name: input.initialDisplayName ?? undefined,
    p_avatar_url: input.avatarUrl ?? undefined,
  });

  if (error) {
    throw persistenceError("Could not sync Clerk profile", error);
  }
};

export const markProfileDeletedFromClerk = async (
  clerkUserId: string,
  eventTimestamp: number,
): Promise<void> => {
  const supabase = createPrivilegedClient();
  const { error } = await supabase.rpc("delete_clerk_profile", {
    p_clerk_user_id: clerkUserId,
    p_event_timestamp: eventTimestamp,
  });

  if (error) {
    throw persistenceError("Could not mark Clerk profile deleted", error);
  }
};

/**
 * User-scoped profile read. Explicit identity filtering also handles admins,
 * whose RLS policy permits reading more than one profile.
 */
export const getCurrentProfile = async (clerkUserId: string): Promise<Profile | null> => {
  const supabase = await createUserServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) {
    throw persistenceError("Could not load current profile", error);
  }

  return data ? mapProfile(data) : null;
};
