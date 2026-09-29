import "server-only";

import { requireAuthContext } from "@/lib/backend/shared/auth-context";
import {
  ensureProfileExists,
  getCurrentProfile,
  markProfileDeletedFromClerk,
  syncProfileFromClerk,
} from "./repository";
import type { ClerkProfileSyncInput, Profile } from "./types";

export const ensureCurrentProfile = async (): Promise<Profile> => {
  const { clerkUserId } = await requireAuthContext();

  await ensureProfileExists(clerkUserId);

  const profile = await getCurrentProfile(clerkUserId);
  if (!profile) {
    throw new Error("Profile exists but is not visible to the current authenticated user");
  }

  return profile;
};

export const handleClerkUserUpsert = async (input: ClerkProfileSyncInput): Promise<void> => {
  await syncProfileFromClerk(input);
};

export const handleClerkUserDeleted = async (
  clerkUserId: string,
  eventTimestamp: number,
): Promise<void> => {
  await markProfileDeletedFromClerk(clerkUserId, eventTimestamp);
};
