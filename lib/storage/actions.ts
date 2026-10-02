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
    const validMimes = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"];
    if (!validMimes.includes(file.type)) {
      return { success: false, error: "Unsupported image format. Allowed: PNG, JPEG, GIF, WebP, SVG." };
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
      // Fallback for local dev when bucket is offline: generate base64 data URL so editor doesn't break
      const base64 = buffer.toString("base64");
      const fallbackDataUrl = `data:${file.type};base64,${base64}`;
      return { success: true, url: fallbackDataUrl };
    }
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || "Failed to upload image." };
  }
}
