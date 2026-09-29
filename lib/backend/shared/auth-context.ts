import "server-only";

import { auth } from "@clerk/nextjs/server";
import { AppError } from "./errors";

export type AuthContext = {
  clerkUserId: string;
};

export const getOptionalAuthContext = async (): Promise<AuthContext | null> => {
  const { userId } = await auth();

  return userId ? { clerkUserId: userId } : null;
};

export const requireAuthContext = async (): Promise<AuthContext> => {
  const context = await getOptionalAuthContext();

  if (!context) {
    throw new AppError("AUTH_REQUIRED", "Authentication is required");
  }

  return context;
};
