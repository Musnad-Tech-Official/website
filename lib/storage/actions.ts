"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

export interface UploadImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Uploads an image file to Supabase Storage.
 * Designed to be called from the Tiptap editor when pasting, dropping, or selecting images.
 */
export async function uploadImageAction(
  formData: FormData,
  bucket = "article-media"
): Promise<UploadImageResult> {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return { success: false, error: "Authentication required to upload media." };
    }

    const role = sessionClaims?.metadata?.role;
    if (role !== "admin") {
      return { success: false, error: "Administrator privileges required to upload media." };
    }

    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No image file provided." };
    }

    // Validate mime type
    const validMimes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
    if (!validMimes.includes(file.type)) {
      return { success: false, error: "Unsupported image format. Allowed: PNG, JPEG, GIF, WebP." };
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "Image size exceeds 10MB limit." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate safe timestamped path
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
    const storagePath = `${year}/${month}/${Date.now()}-${randomSuffix}-${cleanName}`;

    try {
      const supabase = await createClient();
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(storagePath);

      return { success: true, url: publicUrl };
    } catch {
      // Never misrepresent an unsaved upload as successful or embed untrusted data URLs.
      return { success: false, error: "Media storage is temporarily unavailable." };
    }
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to upload image." };
  }
}

/**
 * Uploads an attachment file (PDF, DOC, ZIP, Image) from a prospective client inquiry.
 * Available to public contact submissions without admin authentication.
 */
export async function uploadInquiryAttachmentAction(
  formData: FormData
): Promise<UploadImageResult> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No attachment file provided." };
    }

    // Avoid arbitrary public uploads, including executable documents and archives.
    const allowedTypes: Record<string, string> = {
      ".pdf": "application/pdf",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
    };
    const extension = file.name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] || "";
    if (allowedTypes[extension] !== file.type) {
      return { success: false, error: "Only PDF, PNG, JPEG and WebP attachments are supported." };
    }
    if (file.size === 0 || file.size > 10 * 1024 * 1024) {
      return { success: false, error: "Attachment must be between 1 byte and 10MB." };
    }

    // Disabled until the private inquiry bucket, malware screening, upload
    // throttling and authenticated administrator retrieval are available.
    // Never write an orphaned object or produce a publicly accessible link.
    return {
      success: false,
      error: "Attachments are temporarily unavailable. Please send your inquiry without a file.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: (err as Error).message || "Failed to upload attachment.",
    };
  }
}

