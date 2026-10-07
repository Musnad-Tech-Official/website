"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { ALL_TECH_ITEMS } from "@/components/hero/tech-data";
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

// Master pre-seeded inventory from official tech catalog
const MASTER_TECH_INVENTORY: ManagedTechnology[] = ALL_TECH_ITEMS.map((item, idx) => ({
  id: item.id,
  name: item.name,
  category: inferCategory(item.id),
  enabledHome: true,
  displayOrder: idx + 1,
}));

// In-memory fallback cache
let memoryTechCache: ManagedTechnology[] = [...MASTER_TECH_INVENTORY];
let lastFetch = 0;
const CACHE_TTL_MS = 60 * 1000;

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

/**
 * Retrieves all company technologies (for Dashboard & Admin)
 */
export async function getTechnologiesAction(): Promise<ManagedTechnology[]> {
  const now = Date.now();
  if (lastFetch > 0 && now - lastFetch < CACHE_TTL_MS && memoryTechCache.length > 0) {
    return memoryTechCache;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("technologies")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      memoryTechCache = (data as unknown as TechnologyDbRow[]).map(mapRowToTech);
      lastFetch = now;
      return memoryTechCache;
    }
  } catch (err) {
    console.warn("Could not query technologies table from Supabase, using master memory cache:", err);
  }

  return memoryTechCache;
}

/**
 * Retrieves only active technologies for the Home page
 */
export async function getHomeTechnologiesAction(): Promise<ManagedTechnology[]> {
  const all = await getTechnologiesAction();
  return all.filter((t) => t.enabledHome);
}

/**
 * Toggle whether a technology appears on the Home page
 */
export async function toggleTechnologyHomeAction(
  id: string,
  enabledHome: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();

    // Update in-memory cache
    memoryTechCache = memoryTechCache.map((t) =>
      t.id === id ? { ...t, enabledHome } : t
    );

    // Persist to Supabase if table exists
    try {
      const supabase = await createClient();
      await supabase
        .from("technologies")
        .upsert(
          {
            id,
            enabled_home: enabledHome,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
    } catch (dbErr) {
      console.warn("Supabase technologies table update skipped:", dbErr);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/technologies", "page");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to toggle technology." };
  }
}

/**
 * Add a new technology to the company catalog
 */
export async function addTechnologyAction(
  input: NewTechnologyInput
): Promise<{ success: boolean; data?: ManagedTechnology; error?: string }> {
  try {
    await verifyAdminAuth();

    const cleanId = (input.id || input.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    const newTech: ManagedTechnology = {
      id: cleanId,
      name: input.name.trim(),
      category: input.category || inferCategory(cleanId),
      enabledHome: input.enabledHome ?? true,
      displayOrder: memoryTechCache.length + 1,
      createdAt: new Date().toISOString(),
    };

    memoryTechCache.push(newTech);

    try {
      const supabase = await createClient();
      await supabase.from("technologies").insert({
        id: newTech.id,
        name: newTech.name,
        category: newTech.category,
        enabled_home: newTech.enabledHome,
        display_order: newTech.displayOrder,
      });
    } catch (dbErr) {
      console.warn("Supabase technologies insert skipped:", dbErr);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/technologies", "page");
    return { success: true, data: newTech };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to add technology." };
  }
}

/**
 * Delete a technology from the company catalog
 */
export async function deleteTechnologyAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();

    memoryTechCache = memoryTechCache.filter((t) => t.id !== id);

    try {
      const supabase = await createClient();
      await supabase.from("technologies").delete().eq("id", id);
    } catch (dbErr) {
      console.warn("Supabase technologies delete skipped:", dbErr);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/technologies", "page");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete technology." };
  }
}
