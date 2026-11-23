import { test, expect, assertApplicationResponse } from "./fixtures";
import { signInWithClerkTesting } from "./clerk-test-auth";
import { requireIsolatedAdminCrd, openAdminDeleteConfirmation } from "./admin-content-helpers";

test.describe("isolated About Us company CMS", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("mission, vision, story and value persist without fabricated defaults", async ({ page }, info) => {
    test.setTimeout(135_000);
    const email = process.env.E2E_ADMIN_EMAIL;
    requireIsolatedAdminCrd(email);
    const id = [process.env.GITHUB_RUN_ID, info.project.name, info.retry].join("-").replace(/[^A-Za-z0-9-]/g, "");
    const missionTitle = "CI Mission " + id;
    const valueTitle = "CI Company Value " + id;

    await signInWithClerkTesting(page, email, "admin");
    const response = await page.goto("/en/admin/about", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);
    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
    const profile = page.locator("main form").first();
    await expect(profile).toBeVisible();
    const titles = [missionTitle, "رسالة تجريبية معزولة", "CI Vision", "رؤية تجريبية", "CI Story", "قصة تجريبية"];
    const texts = [
      "CI mission details", "محتوى المهمة في قاعدة الاختبار",
      "CI vision details", "محتوى الرؤية في قاعدة الاختبار",
      "CI story paragraph one", "فقرة القصة الأولى",
      "CI story paragraph two", "فقرة القصة الثانية",
    ];
    for (let i = 0; i < titles.length; i++) await profile.locator("input").nth(i).fill(titles[i]);
    for (let i = 0; i < texts.length; i++) await profile.locator("textarea").nth(i).fill(texts[i]);
    await profile.getByRole("button", { name: "Save Changes" }).click();
    await expect(page.getByText("About content saved successfully.")).toBeVisible({ timeout: 18_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("main form").first().locator("input").first()).toHaveValue(missionTitle, { timeout: 15_000 });
    await expect(page.locator("main form").first().locator("textarea").first()).toHaveValue("CI mission details");

    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
    await page.getByRole("button", { name: /Company Values/ }).click();
    await page.getByRole("button", { name: "Add Value" }).click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await modal.locator("input").nth(0).fill("ci-value-" + id.toLowerCase());
    await modal.locator("input").nth(1).fill(valueTitle);
    await modal.locator("input").nth(2).fill("قيمة اختبارية");
    await modal.locator("textarea").nth(0).fill("Synthetic CI-only company value.");
    await modal.locator("textarea").nth(1).fill("قيمة اختبارية غير حقيقية.");
    await modal.getByRole("button", { name: "Save" }).click();
    await expect(modal).toBeHidden({ timeout: 18_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
    await page.getByRole("button", { name: /Company Values/ }).click();
    const card = page.getByRole("heading", { name: valueTitle, exact: true })
      .locator("xpath=ancestor::div[contains(@class,'justify-between') and contains(@class,'p-5')][1]");
    await expect(card).toContainText("Synthetic CI-only company value.", { timeout: 15_000 });
    const confirm = await openAdminDeleteConfirmation(page, card.getByRole("button", { name: "Delete" }), "Confirm Deletion");
    await confirm.getByRole("button", { name: "Delete" }).click();
    await expect(confirm).toBeHidden({ timeout: 18_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
    await page.getByRole("button", { name: /Company Values/ }).click();
    await expect(page.getByRole("heading", { name: valueTitle, exact: true })).toHaveCount(0);
  });
});
