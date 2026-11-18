import { expect } from "./fixtures";
import type { Locator, Page } from "@playwright/test";

/**
 * Only isolated GitHub Actions Clerk Development + local Supabase may mutate data.
 * Combined with the exact per-run synthetic-account check in clerk-test-auth.ts.
 */
export function requireIsolatedAdminCrd(email: string | undefined): asserts email is string {
  if (
    !email ||
    !process.env.GITHUB_RUN_ID ||
    process.env.E2E_CLERK_DEV_AUTH !== "true" ||
    process.env.E2E_BASE_URL !== "http://localhost:3000" ||
    process.env.E2E_ISOLATED_DATABASE_CONFIRMED !== "true" ||
    process.env.E2E_STAGING_SUPABASE_URL !== "http://127.0.0.1:54321" ||
    !process.env.CLERK_SECRET_KEY?.startsWith("sk_test_")
  ) {
    throw Error("Refusing synthetic content mutations outside isolated Clerk Development and local Supabase CI.");
  }
}

/** Open only a UI modal (safe to retry), after app hydration. */
export async function openAdminEditor(
  page: Page,
  trigger: Locator,
  title: string,
): Promise<Locator> {
  await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible({ timeout: 20_000 });
  const editor = page.locator("div.fixed.inset-0").filter({
    has: page.getByRole("heading", { name: title, exact: true }),
  }).first();
  for (let n = 0; n < 3; n++) {
    await trigger.click({ timeout: 6_000 });
    try {
      await expect(editor).toBeVisible({ timeout: 2_500 });
      return editor;
    } catch {
      // React children can hydrate after the shell. Opening has no DB effects.
    }
  }
  throw Error("Editor did not open after post-hydration attempts: " + title);
}

/** In a transient hydration race, opening the confirmation is safe to retry. */
export async function openAdminDeleteConfirmation(
  page: Page,
  trigger: Locator,
  title: string,
): Promise<Locator> {
  await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible({ timeout: 20_000 });
  const dialog = page.getByRole("dialog");
  for (let n = 0; n < 3; n++) {
    await trigger.click({ timeout: 6_000 });
    try {
      await expect(dialog).toBeVisible({ timeout: 2_500 });
      await expect(dialog).toContainText(title);
      return dialog;
    } catch {
      // Do not retry any destructive confirmation button, only its opener.
    }
  }
  throw Error("Delete confirmation did not open: " + title);
}
