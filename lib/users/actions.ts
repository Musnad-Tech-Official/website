"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

export type AdminUserRole = "admin" | "team" | "member";

export interface AdminUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  email: string;
  imageUrl: string;
  role: AdminUserRole;
  createdAt: number;
  lastSignInAt: number | null;
  banned: boolean;
  locked: boolean;
}

const CACHE_DIR = path.join(process.cwd(), ".data");
const CACHE_FILE = path.join(CACHE_DIR, "users-cache.json");

function readCachedUsers(): AdminUser[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, "utf-8");
      return JSON.parse(data) as AdminUser[];
    }
  } catch {
    // ignore cache read failure
  }
  return [];
}

function writeCachedUsers(users: AdminUser[]): void {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch {
    // ignore cache write failure
  }
}

/**
 * Verifies that the current user is an authenticated administrator.
 */
async function verifyAdminAuth(): Promise<string> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: Authentication required.");
  }

  const role = sessionClaims?.metadata?.role;
  if (role !== "admin") {
    throw new Error("Forbidden: Administrator privileges required.");
  }

  return userId;
}

/**
 * Fetch all registered users with their roles from Clerk.
 */
export async function getUsersAction(): Promise<AdminUser[]> {
  await verifyAdminAuth();

  try {
    const client = await clerkClient();
    const res = await client.users.getUserList({ limit: 100, orderBy: "-created_at" });

    const users: AdminUser[] = res.data.map((u) => {
      const email = u.emailAddresses?.[0]?.emailAddress || "no-email@musnad.tech";
      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username || email.split("@")[0];
      const rawRole = (u.publicMetadata?.role as string) || "member";
      const role: AdminUserRole = rawRole === "admin" || rawRole === "team" ? rawRole : "member";

      return {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        fullName,
        email,
        imageUrl: u.imageUrl || "",
        role,
        createdAt: u.createdAt,
        lastSignInAt: u.lastSignInAt,
        banned: Boolean(u.banned),
        locked: Boolean(u.locked),
      };
    });

    writeCachedUsers(users);
    return users;
  } catch (error) {
    console.warn("Clerk getUsersAction failed, reading from local cache:", error);
    const cached = readCachedUsers();
    if (cached.length > 0) {
      return cached;
    }
    return [];
  }
}

/**
 * Update a user's role in Clerk public metadata.
 */
export async function updateUserRoleAction(
  targetUserId: string,
  newRole: AdminUserRole
): Promise<{ success: boolean; message: string }> {
  const currentAdminId = await verifyAdminAuth();

  if (targetUserId === currentAdminId && newRole !== "admin") {
    throw new Error("Cannot demote your own administrator account.");
  }

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(targetUserId, {
      publicMetadata: {
        role: newRole,
      } as Record<string, unknown>,
    });

    // Update local cache
    const cached = readCachedUsers();
    const index = cached.findIndex((u) => u.id === targetUserId);
    if (index !== -1) {
      cached[index].role = newRole;
      writeCachedUsers(cached);
    }

    revalidatePath("/[locale]/admin/users", "page");
    return { success: true, message: `Role successfully updated to ${newRole}.` };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update user role.";
    throw new Error(msg);
  }
}

/**
 * Toggle user ban status in Clerk.
 */
export async function toggleUserBanAction(
  targetUserId: string,
  ban: boolean
): Promise<{ success: boolean; message: string }> {
  const currentAdminId = await verifyAdminAuth();

  if (targetUserId === currentAdminId) {
    throw new Error("Cannot ban your own administrator account.");
  }

  try {
    const client = await clerkClient();
    if (ban) {
      await client.users.banUser(targetUserId);
    } else {
      await client.users.unbanUser(targetUserId);
    }

    // Update local cache
    const cached = readCachedUsers();
    const index = cached.findIndex((u) => u.id === targetUserId);
    if (index !== -1) {
      cached[index].banned = ban;
      writeCachedUsers(cached);
    }

    revalidatePath("/[locale]/admin/users", "page");
    return {
      success: true,
      message: ban ? "User has been banned." : "User ban has been lifted.",
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to toggle user ban.";
    throw new Error(msg);
  }
}
