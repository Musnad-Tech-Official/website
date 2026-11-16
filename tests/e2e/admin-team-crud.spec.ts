import { test, expect, assertApplicationResponse } from "./fixtures";
import { signInWithClerkTesting } from "./clerk-test-auth";
import type { Locator, Page } from "@playwright/test";

async function openTeamEditor(page: Page, trigger: Locator, heading: string) {
  // React hydration may still be attaching event handlers after DOMContentLoaded.
  // The operation only opens a modal, so bounded retries are safe.
  const modal = page.locator(".fixed.inset-0").filter({
    has: page.getByRole("heading", { name: heading, exact: true }),
  }).first();
  for (let n = 0; n < 3; n++) {
    await trigger.click();
    if (await modal.isVisible().catch(() => false)) return modal;
    try { await expect(modal).toBeVisible({ timeout: 2200 }); return modal; } catch {}
  }
  throw Error("Team editor did not open after bounded hydration retries.");
}

test.describe("isolated team administration persistence", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("admin creates, updates, and deletes an isolated team member", async ({ page }, info) => {
    test.setTimeout(110_000);
    const email = process.env.E2E_ADMIN_EMAIL;
    if (
      !email ||
      process.env.E2E_CLERK_DEV_AUTH !== "true" ||
      process.env.E2E_BASE_URL !== "http://localhost:3000" ||
      process.env.E2E_ISOLATED_DATABASE_CONFIRMED !== "true" ||
      process.env.E2E_STAGING_SUPABASE_URL !== "http://127.0.0.1:54321"
    ) {
      throw Error("Refusing team CRUD outside isolated disposable Development CI.");
    }

    const suffix = [process.env.GITHUB_RUN_ID, info.project.name, info.retry]
      .join("-").replace(/[^A-Za-z0-9-]/g, "");
    const name = "CI Team Member " + suffix;
    const role = "CI Verification Engineer";
    const newRole = "CI Updated QA Engineer";

    await signInWithClerkTesting(page, email, "admin");
    const response = await page.goto("/en/admin/team", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe("/en/admin/team");

    let modal = await openTeamEditor(
      page,
      page.getByRole("button", { name: "Add Team Member" }),
      "Add New Team Member",
    );
    await modal.getByPlaceholder("e.g. Sabri Alshaibani").fill(name);
    await modal.getByPlaceholder("مثال: صبري الشيباني").fill("عضو فريق للاختبار المعزول");
    await modal.getByPlaceholder("Engineering / Technical Lead").fill(role);
    await modal.getByPlaceholder("القائد الهندسي / التقني").fill("مهندس تحقق تجريبي");
    await modal.getByRole("button", { name: "Create Member" }).click();
    await expect(modal).toBeHidden({ timeout: 20_000 });

    await page.reload({ waitUntil: "domcontentloaded" });
    let row = page.locator("tbody tr").filter({ hasText: name });
    await expect(row).toHaveCount(1, { timeout: 15_000 });
    await expect(row).toContainText(role);

    modal = await openTeamEditor(page, row.getByTitle("Edit"), "Edit Team Member");
    await modal.getByPlaceholder("Engineering / Technical Lead").fill(newRole);
    await modal.getByRole("button", { name: "Save Changes" }).click();
    await expect(modal).toBeHidden({ timeout: 20_000 });

    await page.reload({ waitUntil: "domcontentloaded" });
    row = page.locator("tbody tr").filter({ hasText: name });
    await expect(row).toHaveCount(1, { timeout: 15_000 });
    await expect(row).toContainText(newRole);

    // Delete only the uniquely named record created by this CI run.
    await row.getByTitle("Delete").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 8000 });
    await expect(dialog).toContainText("Delete Team Member");
    await dialog.getByRole("button", { name: "Confirm Delete" }).click();
    await expect(dialog).toBeHidden({ timeout: 20_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("tbody tr").filter({ hasText: name })).toHaveCount(0);
  });
});
