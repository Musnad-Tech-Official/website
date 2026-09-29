import { z } from "zod";

export const profileUpdateSchema = z
  .object({
    displayName: z.string().trim().min(1).max(80).nullable().optional(),
    preferredLocale: z.enum(["en", "ar"]).optional(),
  })
  .strict();

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
