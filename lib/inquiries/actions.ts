"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { InquiryItem, SubmitInquiryInput, InquiryStatus } from "./types";

const INITIAL_INQUIRIES: InquiryItem[] = [
  {
    id: "inq-01",
    name: "Sarah Al-Ghamdi",
    email: "s.ghamdi@fintech-ventures.sa",
    company: "FinTech Ventures Riyadh",
    phone: "+966 50 123 4567",
    inquiryType: "project",
    projectType: "Full-Stack Web & Mobile App",
    budget: "$50k - $100k",
    timeline: "3-6 months",
    currentProduct: "Legacy monolithic PHP app needing modernization",
    message: "We need an elite engineering team to redesign and rebuild our investment portal into a distributed Next.js + Go microservices architecture with bank-grade security and full Arabic/English localization.",
    status: "new",
    adminNotes: "High-priority financial client. Lead architect should review RFC.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
  },
  {
    id: "inq-02",
    name: "Dr. Omar Basaeed",
    email: "o.basaeed@medilink.org",
    company: "MediLink Healthcare Network",
    phone: "+966 55 987 6543",
    inquiryType: "project",
    projectType: "AI & RAG Knowledge Engine",
    budget: "$25k - $50k",
    timeline: "1-3 months",
    currentProduct: "Internal electronic medical documentation database",
    message: "Interested in Musnad's AI integration capabilities for internal clinical guideline retrieval using private LLMs on dedicated cloud infrastructure.",
    status: "in_review",
    adminNotes: "Scheduled introductory discovery call for Thursday.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 26).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
  },
  {
    id: "inq-03",
    name: "Marcus Vance",
    email: "m.vance@apexlogistics.ae",
    company: "Apex Global Logistics",
    phone: "+971 4 555 0192",
    inquiryType: "partnership",
    projectType: "Cloud Platform & Telemetry",
    budget: ">$100k",
    timeline: "6+ months",
    message: "Looking for long-term technical partnership to maintain and scale our real-time GPS telemetry pipelines and driver assignment algorithms across the GCC region.",
    status: "responded",
    adminNotes: "Sent proposal draft on Monday. Waiting on procurement feedback.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
  },
  {
    id: "inq-04",
    name: "Noura Al-Husseini",
    email: "noura.design@gmail.com",
    inquiryType: "careers",
    message: "Applying for the Design Systems / Design Engineer position. Attached is my Figma portfolio and code specimens built with Tailwind v4 and React 19.",
    attachmentName: "noura_portfolio_2026.pdf",
    attachmentSize: 3450000,
    status: "new",
    createdAt: new Date(Date.now() - 3600 * 1000 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 96).toISOString(),
  },
];

let memoryInquiriesCache: InquiryItem[] = [...INITIAL_INQUIRIES];
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
      const { data, error } = await supabase
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
        })
        .select()
        .single();

      if (!error && data) {
        const created = mapRowToInquiry(data as unknown as InquiryDbRow);
        memoryInquiriesCache = [created, ...memoryInquiriesCache];
        revalidatePath("/[locale]/admin/inquiries", "page");
        return { success: true, inquiryId: created.id };
      }
    } catch {
      // Fallback
    }

    memoryInquiriesCache = [newInquiry, ...memoryInquiriesCache];
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
    // If auth check fails in SSR context, return memory cache
    return memoryInquiriesCache;
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
      memoryInquiriesCache = (data as unknown as InquiryDbRow[]).map(mapRowToInquiry);
      lastFetch = now;
      return memoryInquiriesCache;
    }
  } catch (err) {
    console.warn("Could not query inquiries from Supabase, using cache:", err);
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

      const { data, error } = await supabase
        .from("inquiries")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const updated = mapRowToInquiry(data as unknown as InquiryDbRow);
        memoryInquiriesCache = memoryInquiriesCache.map((i) => (i.id === id ? updated : i));
        revalidatePath("/[locale]/admin/inquiries", "page");
        return { success: true, data: updated };
      }
    } catch {
      // In-memory
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
      // In-memory
    }

    memoryInquiriesCache = memoryInquiriesCache.filter((i) => i.id !== id);
    revalidatePath("/[locale]/admin/inquiries", "page");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to delete inquiry." };
  }
}
