import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

import {
  handleClerkUserDeleted,
  handleClerkUserUpsert,
} from "@/lib/backend/identity/service";

const normalizeEmail = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim().toLowerCase();
  return trimmed ? trimmed : null;
};

const buildDisplayName = (
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  username: string | null | undefined,
): string | null => {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || username?.trim() || null;
};

const normalizeEventTimestamp = (value: unknown): number | null => {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value <= 0
  ) {
    return null;
  }

  const milliseconds =
    value < 10_000_000_000
      ? value * 1000
      : value;

  return Number.isSafeInteger(milliseconds)
    ? milliseconds
    : null;
};

const getRawTimestamp = (payload: unknown): unknown => {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("timestamp" in payload)
  ) {
    return undefined;
  }

  return (payload as { timestamp?: unknown }).timestamp;
};

export async function POST(request: NextRequest) {
  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return new Response("Invalid webhook payload", { status: 400 });
  }

  const verificationRequest = new NextRequest(request.url, {
    method: "POST",
    headers: request.headers,
    body: rawBody,
  });

  let event: Awaited<ReturnType<typeof verifyWebhook>>;

  try {
    event = await verifyWebhook(verificationRequest);
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  let rawPayload: unknown;

  try {
    rawPayload = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid webhook payload", { status: 400 });
  }

  const eventTimestamp = normalizeEventTimestamp(
    getRawTimestamp(rawPayload),
  );

  if (eventTimestamp === null) {
    return new Response("Invalid webhook timestamp", { status: 400 });
  }

  try {
    if (event.type === "user.created" || event.type === "user.updated") {
      const user = event.data;

      const primaryEmail = user.email_addresses.find(
        (email) => email.id === user.primary_email_address_id,
      );

      await handleClerkUserUpsert({
        clerkUserId: user.id,
        eventTimestamp: Math.max(
          eventTimestamp,
          user.updated_at ?? 0,
        ),
        primaryEmail: normalizeEmail(primaryEmail?.email_address),
        initialDisplayName: buildDisplayName(
          user.first_name,
          user.last_name,
          user.username,
        ),
        avatarUrl: user.image_url ?? null,
      });
    } else if (event.type === "user.deleted") {
      if (!event.data.id) {
        return new Response("Invalid Clerk user ID", { status: 400 });
      }

      await handleClerkUserDeleted(
        event.data.id,
        eventTimestamp,
      );
    }

    return new Response(null, { status: 204 });
  } catch {
    console.error("Clerk webhook processing failed", {
      type: event.type,
      timestamp: eventTimestamp,
    });

    return new Response("Webhook processing failed", { status: 500 });
  }
}
