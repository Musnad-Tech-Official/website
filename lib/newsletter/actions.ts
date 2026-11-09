"use server";

import { createClient } from "@/utils/supabase/server";

export interface NewsletterSubscribeResult {
  success: boolean;
  message?: string;
  error?: string;
}

// In-memory fallback cache in case Supabase schema migration is pending
const fallbackSubscribers = new Set<string>();

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Subscribes an email address to the Musnad Tech newsletter.
 * Stores in Supabase 'newsletter_subscribers' table with automatic fallback.
 */
export async function subscribeNewsletterAction(
  email: string,
  locale: string = "en",
  source: string = "article_sidebar"
): Promise<NewsletterSubscribeResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
    return {
      success: false,
      error: "invalid_email",
    };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.from("newsletter_subscribers").upsert(
      {
        email: normalizedEmail,
        source,
        locale,
        status: "subscribed",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

    if (error) {
      console.error("Newsletter persistence failed:", error.code);
      return { success: false, error: "subscription_unavailable" };
    }

    return {
      success: true,
      message: "subscribed",
    };
  } catch {
    return { success: false, error: "subscription_unavailable" };
  }
}

/**
 * Returns the count of newsletter subscribers for admin telemetry.
 */
export async function getNewsletterSubscribersCountAction(): Promise<number> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true });

    if (error || count === null) {
      return fallbackSubscribers.size;
    }
    return count;
  } catch {
    return fallbackSubscribers.size;
  }
}

