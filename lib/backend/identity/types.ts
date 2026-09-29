export type ProfileStatus = "active" | "suspended" | "deleted";
export type SupportedLocale = "en" | "ar";

export type Profile = {
  id: string;
  clerkUserId: string;
  primaryEmail: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  preferredLocale: SupportedLocale;
  status: ProfileStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ClerkProfileSyncInput = {
  clerkUserId: string;
  eventTimestamp: number;
  primaryEmail: string | null;
  initialDisplayName: string | null;
  avatarUrl: string | null;
};
