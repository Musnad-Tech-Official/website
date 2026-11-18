import { test, expect, assertApplicationResponse } from "./fixtures";
import { signInWithClerkTesting } from "./clerk-test-auth";
import { requireIsolatedAdminCrd } from "./admin-content-helpers";

test.describe("temporary Clerk Development user administration", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("only disposable member: role team/member and ban/unban persist in Clerk Development", async ({ page }) => {
    test.setTimeout(130_000);
    const adminEmail = process.env.E2E_ADMIN_EMAIL;
    const memberEmail = process.env.E2E_MEMBER_EMAIL;
    requireIsolatedAdminCrd(adminEmail);
    requireIsolatedAdminCrd(memberEmail);
    const expectedMember = "musnad-e2e+clerk_test_member_" + process.env.GITHUB_RUN_ID + "_" +
      (process.env.GITHUB_RUN_ATTEMPT || "1") + "@example.com";
    if (memberEmail !== expectedMember) {
      throw Error("Refusing user-management changes to any non-synthetic account.");
    }
    await signInWithClerkTesting(page, adminEmail, "admin");
    const response = await page.goto("/en/admin/users", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);
    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
    let row = page.locator("tbody tr").filter({ hasText: memberEmail });
    await expect(row).toHaveCount(1, { timeout: 20_000 });
    await expect(row).toContainText("member");
    await row.getByRole("button", { name: "Role" }).click();
    let dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Assign User Role");
    await dialog.getByText("Team Contributor").click();
    await dialog.getByRole("button", { name: "Save Role" }).click();
    await expect(dialog).toBeHidden({ timeout: 18_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    row = page.locator("tbody tr").filter({ hasText: memberEmail });
    await expect(row).toContainText("team");

    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
    await row.getByRole("button", { name: "Role" }).click();
    dialog = page.getByRole("dialog");
    await dialog.getByText("Standard Member").click();
    await dialog.getByRole("button", { name: "Save Role" }).click();
    await expect(dialog).toBeHidden({ timeout: 18_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    row = page.locator("tbody tr").filter({ hasText: memberEmail });
    await expect(row).toContainText("member");

    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
    await row.getByTitle("Ban user").click();
    dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Ban User Account");
    await dialog.getByRole("button", { name: "Ban User" }).click();
    await expect(dialog).toBeHidden({ timeout: 18_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    row = page.locator("tbody tr").filter({ hasText: memberEmail });
    await expect(row).toContainText("Banned");

    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
    await row.getByTitle("Unban user").click();
    dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Lift User Ban");
    await dialog.getByRole("button", { name: "Lift Ban" }).click();
    await expect(dialog).toBeHidden({ timeout: 18_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    row = page.locator("tbody tr").filter({ hasText: memberEmail });
    await expect(row).toContainText("Active");
    await expect(row).toContainText("member");
  });
});
