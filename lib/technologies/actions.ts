"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { ManagedTechnology, NewTechnologyInput } from "./types";

/**
 * Categorize pre-seeded items
 */
function inferCategory(id: string): ManagedTechnology["category"] {
  const frontends = ["vite", "nextjs", "react", "tailwind", "typescript", "javascript", "figma"];
  const backends = ["nodejs", "nestjs", "springboot", "java", "php", "go", "rust", "fastapi", "graphql"];
  const databases = ["postgresql", "mysql", "mongodb", "redis", "clickhouse", "supabase", "firebase"];
  const devops = ["docker"];
  const mobiles = ["react-native", "expo", "electron"];
  const ai = ["python"];

  if (frontends.includes(id)) return "Frontend";
  if (backends.includes(id)) return "Backend";
  if (databases.includes(id)) return "Database";
  if (devops.includes(id)) return "DevOps & Cloud";
  if (mobiles.includes(id)) return "Mobile & Desktop";
  if (ai.includes(id)) return "AI & Realtime";
  return "Other";
}

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

interface TechnologyDbRow {
  id: string;
  name: string;
  category: string;
  enabled_home: boolean;
  display_order: number;
  created_at: string;
}

function mapRowToTech(row: TechnologyDbRow): ManagedTechnology {
  return {
    id: row.id,
    name: row.name,
    category: (row.category as ManagedTechnology["category"]) || "Other",
    enabledHome: Boolean(row.enabled_home),
    displayOrder: row.display_order ?? 0,
    createdAt: row.created_at,
  };
}

function revalidateTechnologies(): void {
  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]/admin/technologies", "page");
}

/** Only show technologies actually persisted in Supabase. */
export async function getTechnologiesAction(): Promise<ManagedTechnology[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("technologies").select("*").order("display_order", { ascending: true });
  if (error) {
    console.error("Failed to query technologies:", error.code);
    throw new Error("Technology catalog is unavailable.");
  }
  return ((data ?? []) as TechnologyDbRow[]).map(mapRowToTech);
}

export async function getHomeTechnologiesAction(): Promise<ManagedTechnology[]> {
  return (await getTechnologiesAction()).filter((technology) => technology.enabledHome);
}

export async function toggleTechnologyHomeAction(
  id: string,
  enabledHome: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();
    const supabase = await createClient();
    const { data, error } = await supabase.from("technologies")
      .update({ enabled_home: enabledHome })
      .eq("id", id).select("id").single();
    if (error || !data) {
      console.error("Failed to toggle technology:", error?.code || "no-data");
      return { success: false, error: "Technology change was not saved." };
    }
    revalidateTechnologies();
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to toggle technology." };
  }
}

export async function addTechnologyAction(
  input: NewTechnologyInput
): Promise<{ success: boolean; data?: ManagedTechnology; error?: string }> {
  try {
    await verifyAdminAuth();
    const name = input.name.trim();
    const cleanId = (input.id || name).toLowerCase().trim()
      .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    if (!name || !cleanId) return { success: false, error: "Technology name and ID are required." };

    const displayOrder = (await getTechnologiesAction()).reduce((max, t) => Math.max(max, t.displayOrder), 0) + 1;
    const supabase = await createClient();
    const { data, error } = await supabase.from("technologies").insert({
      id: cleanId,
      name,
      category: input.category || inferCategory(cleanId),
      enabled_home: input.enabledHome ?? true,
      display_order: displayOrder,
    }).select().single();

    if (error || !data) {
      console.error("Failed to create technology:", error?.code || "no-data");
      return { success: false, error: "Technology was not saved." };
    }
    revalidateTechnologies();
    return { success: true, data: mapRowToTech(data as TechnologyDbRow) };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to add technology." };
  }
}

export async function deleteTechnologyAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();
    const supabase = await createClient();
    const { data, error } = await supabase.from("technologies")
      .delete().eq("id", id).select("id").single();
    if (error || !data) {
      console.error("Failed to delete technology:", error?.code || "no-data");
      return { success: false, error: "Technology was not deleted." };
    }
    revalidateTechnologies();
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete technology." };
  }
}
