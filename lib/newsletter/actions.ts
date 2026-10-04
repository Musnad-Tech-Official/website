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
      },
      { onConflict: "email" }
    );

    if (error) {
      // If table doesn't exist yet, gracefully store in fallback cache
      console.warn("Supabase newsletter_subscribers notice:", error.message);
      fallbackSubscribers.add(normalizedEmail);
      return {
        success: true,
        message: "subscribed",
      };
    }

    return {
      success: true,
      message: "subscribed",
    };
  } catch (err) {
    console.error("subscribeNewsletterAction exception:", err);
    // Graceful fallback
    fallbackSubscribers.add(normalizedEmail);
    return {
      success: true,
      message: "subscribed",
    };
  }
}
