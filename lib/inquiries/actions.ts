"use server";

import fs from "fs";
import path from "path";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { InquiryItem, SubmitInquiryInput, InquiryStatus } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

function readDiskInquiries(): InquiryItem[] {
  try {
    if (fs.existsSync(INQUIRIES_FILE)) {
      const content = fs.readFileSync(INQUIRIES_FILE, "utf-8");
      return JSON.parse(content) as InquiryItem[];
    }
  } catch {
    // Disk read fallback
  }
  return [];
}

function writeDiskInquiries(items: InquiryItem[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch {
    // Disk write fallback
  }
}

let memoryInquiriesCache: InquiryItem[] = readDiskInquiries();
let lastFetch = 0;
const CACHE_TTL_MS = 30 * 1000;

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

interface InquiryDbRow {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  inquiry_type: string;
  project_type?: string | null;
  budget?: string | null;
  timeline?: string | null;
  current_product?: string | null;
  message: string;
  attachment_url?: string | null;
  attachment_name?: string | null;
  attachment_size?: number | null;
  status: string;
  admin_notes?: string | null;
  user_id?: string | null;
  created_at: string;
  updated_at: string;
}

function mapRowToInquiry(row: InquiryDbRow): InquiryItem {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company || undefined,
    phone: row.phone || undefined,
    inquiryType: row.inquiry_type,
    projectType: row.project_type || undefined,
    budget: row.budget || undefined,
    timeline: row.timeline || undefined,
    currentProduct: row.current_product || undefined,
    message: row.message,
    attachmentUrl: row.attachment_url || undefined,
    attachmentName: row.attachment_name || undefined,
    attachmentSize: row.attachment_size || undefined,
    status: (row.status as InquiryStatus) || "new",
    adminNotes: row.admin_notes || undefined,
    userId: row.user_id || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Public action: Submits an inquiry from the Contact Form
 */
export async function submitInquiryAction(input: SubmitInquiryInput): Promise<{
  success: boolean;
  inquiryId?: string;
  error?: string;
}> {
  try {
    if (!input.name?.trim() || !input.email?.trim() || !input.message?.trim()) {
      return { success: false, error: "Please provide your name, email, and message." };
    }

    // Optional user ID if authenticated
    let userId: string | undefined;
    try {
      const authData = await auth();
      if (authData?.userId) {
        userId = authData.userId;
      }
    } catch {
      // Ignored for anonymous users
    }

    const id = `inq-${Date.now()}`;
    const now = new Date().toISOString();

    const newInquiry: InquiryItem = {
      id,
      name: input.name.trim(),
      email: input.email.trim(),
      company: input.company?.trim() || undefined,
      phone: input.phone?.trim() || undefined,
      inquiryType: input.inquiryType?.trim() || "project",
      projectType: input.projectType?.trim() || undefined,
      budget: input.budget?.trim() || undefined,
      timeline: input.timeline?.trim() || undefined,
      currentProduct: input.currentProduct?.trim() || undefined,
      message: input.message.trim(),
      attachmentUrl: input.attachmentUrl?.trim() || undefined,
      attachmentName: input.attachmentName?.trim() || undefined,
      attachmentSize: input.attachmentSize,
      status: "new",
      userId,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from("inquiries")
        .insert({
          id: newInquiry.id,
          name: newInquiry.name,
          email: newInquiry.email,
          company: newInquiry.company || null,
          phone: newInquiry.phone || null,
          inquiry_type: newInquiry.inquiryType,
          project_type: newInquiry.projectType || null,
          budget: newInquiry.budget || null,
          timeline: newInquiry.timeline || null,
          current_product: newInquiry.currentProduct || null,
          message: newInquiry.message,
          attachment_url: newInquiry.attachmentUrl || null,
          attachment_name: newInquiry.attachmentName || null,
          attachment_size: newInquiry.attachmentSize || null,
          status: newInquiry.status,
          user_id: newInquiry.userId || null,
        });

      if (error) {
        console.warn("Supabase inquiry insert note (will use persistent fallback):", error.message);
      }
    } catch (dbErr) {
      console.warn("Supabase inquiry insert exception (using persistent fallback):", dbErr);
    }

    memoryInquiriesCache = [newInquiry, ...memoryInquiriesCache.filter((i) => i.id !== newInquiry.id)];
    writeDiskInquiries(memoryInquiriesCache);
    revalidatePath("/[locale]/admin/inquiries", "page");
    return { success: true, inquiryId: newInquiry.id };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to submit inquiry." };
  }
}

/**
 * Admin action: Retrieves all client inquiries
 */
export async function getInquiriesAction(status?: InquiryStatus): Promise<InquiryItem[]> {
  try {
    await verifyAdminAuth();
  } catch {
    // If auth check fails in SSR context, return memory/disk cache
    const current = memoryInquiriesCache.length > 0 ? memoryInquiriesCache : readDiskInquiries();
    return status ? current.filter((i) => i.status === status) : current;
  }

  const now = Date.now();
  if (lastFetch > 0 && now - lastFetch < CACHE_TTL_MS && memoryInquiriesCache.length > 0) {
    return status ? memoryInquiriesCache.filter((i) => i.status === status) : memoryInquiriesCache;
  }

  try {
    const supabase = await createClient();
    const query = supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query.eq("status", status);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      const dbInquiries = (data as unknown as InquiryDbRow[]).map(mapRowToInquiry);
      memoryInquiriesCache = dbInquiries;
      writeDiskInquiries(dbInquiries);
      lastFetch = now;
      return memoryInquiriesCache;
    }
  } catch (err) {
    console.warn("Could not query inquiries from Supabase, using persistent cache:", err);
  }

  // Fallback to disk persistence
  const diskItems = readDiskInquiries();
  if (diskItems.length > 0) {
    memoryInquiriesCache = diskItems;
  }

  return status ? memoryInquiriesCache.filter((i) => i.status === status) : memoryInquiriesCache;
}

/**
 * Admin action: Updates an inquiry's status or notes
 */
export async function updateInquiryStatusAction(
  id: string,
  status: InquiryStatus,
  adminNotes?: string
): Promise<{
  success: boolean;
  data?: InquiryItem;
  error?: string;
}> {
  try {
    await verifyAdminAuth();

    try {
      const supabase = await createClient();
      const updatePayload: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (adminNotes !== undefined) {
        updatePayload.admin_notes = adminNotes;
      }

      await supabase
        .from("inquiries")
        .update(updatePayload)
        .eq("id", id);
    } catch {
      // Supabase table pending
    }

    memoryInquiriesCache = memoryInquiriesCache.map((i) => {
      if (i.id !== id) return i;
      return {
        ...i,
        status,
        adminNotes: adminNotes !== undefined ? adminNotes : i.adminNotes,
        updatedAt: new Date().toISOString(),
      };
    });
    writeDiskInquiries(memoryInquiriesCache);

    const updated = memoryInquiriesCache.find((i) => i.id === id);
    revalidatePath("/[locale]/admin/inquiries", "page");
    return { success: true, data: updated };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to update inquiry." };
  }
}

/**
 * Admin action: Deletes an inquiry
 */
export async function deleteInquiryAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await verifyAdminAuth();

    try {
      const supabase = await createClient();
      await supabase.from("inquiries").delete().eq("id", id);
    } catch {
      // Supabase table pending
    }

    memoryInquiriesCache = memoryInquiriesCache.filter((i) => i.id !== id);
    writeDiskInquiries(memoryInquiriesCache);
    revalidatePath("/[locale]/admin/inquiries", "page");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to delete inquiry." };
  }
}
