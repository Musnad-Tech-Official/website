import { test, expect, assertApplicationResponse } from "./fixtures";
import { signInWithClerkTesting } from "./clerk-test-auth";
import type { Page, Locator } from "@playwright/test";

// Next.js development hydration may still be attaching event handlers after
// DOMContentLoaded. Re-attempt only the idempotent modal-opening action.
async function openModal(page: Page, trigger: Locator): Promise<Locator> {
  const dialog = page.getByRole("dialog");
  for (let attempt = 0; attempt < 3; attempt++) {
    await trigger.click();
    try {
      await expect(dialog).toBeVisible({ timeout: 2_500 });
      return dialog;
    } catch {
      // Give React's pending hydration work a chance before a bounded retry.
    }
  }
  const structure = await page.evaluate(() => ({
    dialogCount: document.querySelectorAll('[role="dialog"]').length,
    buttonCount: document.querySelectorAll("button").length,
  }));
  throw new Error("Admin editor did not open after hydration attempts: " + JSON.stringify(structure));
}

test.describe("isolated admin service persistence", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("admin creates, updates, and deletes a synthetic service in real local Supabase", async ({ page }, testInfo) => {
    test.setTimeout(100_000);

    const email = process.env.E2E_ADMIN_EMAIL;
    if (
      !email ||
      process.env.E2E_CLERK_DEV_AUTH !== "true" ||
      process.env.E2E_BASE_URL !== "http://localhost:3000" ||
      process.env.E2E_ISOLATED_DATABASE_CONFIRMED !== "true"
    ) {
      // Never issue CRUD operations on a remote preview or production site.
      throw new Error("Refusing dashboard CRUD without disposable Development admin and local database.");
    }

    const id = [process.env.GITHUB_RUN_ID, testInfo.project.name, testInfo.retry]
      .join("-")
      .replace(/[^a-zA-Z0-9-]/g, "");
    const initialTitle = `CI Service ${id}`;
    const updatedTitle = `CI Updated Service ${id}`;

    await signInWithClerkTesting(page, email, "admin");
    const response = await page.goto("/en/admin/services", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toMatch(/\/en\/admin\/services\/?$/);

    let dialog = await openModal(page, page.getByRole("button", { name: "Add New Service" }).first());
    await dialog.getByPlaceholder("e.g. Platform & Cloud Infrastructure").fill(initialTitle);
    await dialog.getByPlaceholder("مثال: البنية التحتية والمنصات السحابية").fill("خدمة تجريبية آلية معزولة");
    await dialog.locator("textarea").nth(0).fill("Synthetic CI-only service used to verify real Supabase persistence.");
    await dialog.locator("textarea").nth(1).fill("سجل تجريبي في قاعدة بيانات محلية معزولة للاختبارات فقط.");
    await dialog.getByRole("button", { name: "Create Service" }).click();
    await expect(dialog).toBeHidden({ timeout: 20_000 });

    // A reload proves this is not only an optimistic React state update.
    await page.reload({ waitUntil: "domcontentloaded" });
    let card = page.locator(".group").filter({
      has: page.getByRole("heading", { name: initialTitle, exact: true }),
    });
    await expect(card).toHaveCount(1, { timeout: 15_000 });

    dialog = await openModal(page, card.getByTitle("Edit service"));
    await dialog.getByPlaceholder("e.g. Platform & Cloud Infrastructure").fill(updatedTitle);
    await dialog.getByRole("button", { name: "Save Changes" }).click();
    await expect(dialog).toBeHidden({ timeout: 20_000 });

    await page.reload({ waitUntil: "domcontentloaded" });
    card = page.locator(".group").filter({
      has: page.getByRole("heading", { name: updatedTitle, exact: true }),
    });
    await expect(card).toHaveCount(1, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: initialTitle, exact: true })).toHaveCount(0);

    dialog = await openModal(page, card.getByTitle("Delete service"));
    await expect(dialog).toContainText("Delete Engineering Service?");
    await dialog.getByRole("button", { name: "Yes, Delete Service" }).click();
    await expect(dialog).toBeHidden({ timeout: 20_000 });

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: updatedTitle, exact: true })).toHaveCount(0);
  });
});
