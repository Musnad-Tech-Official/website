import { test, expect, assertApplicationResponse } from "./fixtures";
import { signInWithClerkTesting } from "./clerk-test-auth";
import { requireIsolatedAdminCrd } from "./admin-content-helpers";

test.describe("isolated page visibility and technologies", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("contact route is live/hidden/maintenance/live in both languages", async ({ page, browser }) => {
    test.setTimeout(125_000);
    const email = process.env.E2E_ADMIN_EMAIL;
    requireIsolatedAdminCrd(email);
    await signInWithClerkTesting(page, email, "admin");
    const response = await page.goto("/en/admin/pages", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);
    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();

    const row = page.locator("tbody tr").filter({ hasText: "Contact CI Route" });
    await expect(row).toHaveCount(1, { timeout: 15_000 });
    const guest = await browser.newContext({ baseURL: "http://localhost:3000" });
    try {
      for (const locale of ["en", "ar"]) {
        expect((await guest.request.get("/" + locale + "/contact")).status()).toBe(200);
      }

      await row.getByRole("button", { name: "Hidden", exact: true }).click();
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(page.locator("tbody tr").filter({ hasText: "Contact CI Route" })
        .getByRole("button", { name: "Hidden", exact: true })).toHaveClass(/bg-rose-500/);
      for (const locale of ["en", "ar"]) {
        expect((await guest.request.get("/" + locale + "/contact")).status(),
          "Hidden route must be HTTP 404 for anonymous visitor").toBe(404);
      }

      await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
      await row.getByRole("button", { name: "Maint", exact: true }).click();
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(page.locator("tbody tr").filter({ hasText: "Contact CI Route" })
        .getByRole("button", { name: "Maint", exact: true })).toHaveClass(/bg-amber-500/);
      for (const locale of ["en", "ar"]) {
        const resp = await guest.request.get("/" + locale + "/contact");
        expect(resp.status()).toBe(200);
        const html = await resp.text();
        expect(html).not.toContain("contact-email");
      }

      await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
      await row.getByRole("button", { name: "Live", exact: true }).click();
      await page.reload({ waitUntil: "domcontentloaded" });
      for (const locale of ["en", "ar"]) {
        const resp = await guest.request.get("/" + locale + "/contact");
        expect(resp.status()).toBe(200);
        expect(await resp.text()).toContain("contact-email");
      }
    } finally {
      await guest.close();
    }
  });

  test("technologies catalog add, home toggle and durable delete", async ({ page }, info) => {
    test.setTimeout(100_000);
    const email = process.env.E2E_ADMIN_EMAIL;
    requireIsolatedAdminCrd(email);
    const suffix = [process.env.GITHUB_RUN_ID, info.project.name, info.retry]
      .join("-").replace(/[^A-Za-z0-9-]/g, "");
    const name = "CI Tool " + suffix;

    await signInWithClerkTesting(page, email, "admin");
    const response = await page.goto("/en/admin/technologies", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);
    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
    await page.getByRole("button", { name: "Add Technology" }).click();
    const modal = page.locator("div.fixed.inset-0");
    await expect(modal).toBeVisible();
    await modal.getByPlaceholder("e.g. Svelte, Kafka, Snowflake, Flutter").fill(name);
    await modal.locator("#enabledHomeCheck").uncheck();
    await modal.getByRole("button", { name: "Add to Catalog" }).click();
    await expect(modal).toBeHidden({ timeout: 18_000 });
    await page.reload({ waitUntil: "domcontentloaded" });

    let card = page.getByText(name, { exact: true })
      .locator("xpath=ancestor::div[contains(@class,'rounded-2xl') and contains(@class,'justify-between')][1]");
    await expect(card).toBeVisible({ timeout: 15_000 });
    await expect(card.getByTitle("Hidden from Home (click to show)")).toBeVisible();
    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
    await card.getByTitle("Hidden from Home (click to show)").click();
    await expect(card.getByTitle("Shown on Home Page (click to hide)")).toBeVisible({ timeout: 15_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    card = page.getByText(name, { exact: true })
      .locator("xpath=ancestor::div[contains(@class,'rounded-2xl') and contains(@class,'justify-between')][1]");
    await expect(card.getByTitle("Shown on Home Page (click to hide)")).toBeVisible();

    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
    page.once("dialog", (dialog) => dialog.accept());
    await card.getByTitle("Delete").click();
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByText(name, { exact: true })).toHaveCount(0);
  });
});
