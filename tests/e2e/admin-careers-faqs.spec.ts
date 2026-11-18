import { test, expect, assertApplicationResponse } from "./fixtures";
import { signInWithClerkTesting } from "./clerk-test-auth";
import { requireIsolatedAdminCrd, openAdminDeleteConfirmation } from "./admin-content-helpers";

const parentCard = "xpath=ancestor::div[contains(@class,'flex-col') and contains(@class,'justify-between')][1]";

test.describe("isolated careers and FAQ administration", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("career vacancy CRUD and active/inactive persistence", async ({ page }, info) => {
    test.setTimeout(115_000);
    const email = process.env.E2E_ADMIN_EMAIL;
    requireIsolatedAdminCrd(email);
    const id = [process.env.GITHUB_RUN_ID, info.project.name, info.retry].join("-").replace(/[^a-zA-Z0-9-]/g, "");
    const title = "CI Career " + id;
    const revised = "CI Updated Career " + id;
    const response = await (async () => {
      await signInWithClerkTesting(page, email, "admin");
      return page.goto("/en/admin/careers", { waitUntil: "domcontentloaded" });
    })();
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);
    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();

    await page.getByRole("button", { name: /Add Job Position/ }).click();
    let dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.locator('input').nth(0).fill(title);
    await dialog.locator('input').nth(1).fill("وظيفة اختبارية معزولة");
    await dialog.getByPlaceholder("senior-backend-engineer").fill("ci-career-" + id.toLowerCase());
    await dialog.locator('textarea').nth(0).fill("Synthetic vacancy for local CI only.");
    await dialog.locator('textarea').nth(1).fill("وصف تجريبي معزول في البيئة المحلية.");
    await dialog.getByRole("button", { name: "Save Job" }).click();
    await expect(dialog).toBeHidden({ timeout: 20_000 });

    await page.reload({ waitUntil: "domcontentloaded" });
    let card = page.getByText(title, { exact: true }).locator(parentCard);
    await expect(card).toBeVisible({ timeout: 15_000 });
    await expect(card).toContainText("Active");

    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
    await card.getByRole("switch").uncheck({ force: true });
    await expect(card).toContainText("Inactive");
    await page.reload({ waitUntil: "domcontentloaded" });
    card = page.getByText(title, { exact: true }).locator(parentCard);
    await expect(card).toContainText("Inactive");

    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
    await card.getByRole("button", { name: "Edit" }).click();
    dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.locator('input').nth(0).fill(revised);
    await dialog.getByRole("button", { name: "Save Job" }).click();
    await expect(dialog).toBeHidden({ timeout: 20_000 });

    await page.reload({ waitUntil: "domcontentloaded" });
    card = page.getByText(revised, { exact: true }).locator(parentCard);
    await expect(card).toBeVisible({ timeout: 15_000 });
    await expect(card).toContainText("Inactive");

    const confirm = await openAdminDeleteConfirmation(page, card.getByRole("button", { name: "Delete" }), "Confirm Deletion");
    await confirm.getByRole("button", { name: "Delete" }).click();
    await expect(confirm).toBeHidden({ timeout: 20_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByText(revised, { exact: true })).toHaveCount(0);
  });

  test("FAQ topic and bilingual question CRUD in local database", async ({ page }, info) => {
    test.setTimeout(140_000);
    const email = process.env.E2E_ADMIN_EMAIL;
    requireIsolatedAdminCrd(email);
    const id = [process.env.GITHUB_RUN_ID, info.project.name, info.retry].join("-").replace(/[^a-zA-Z0-9-]/g, "");
    const slug = "ci-faq-" + id.toLowerCase();
    const topic = "CI FAQ Topic " + id;
    const question = "CI FAQ Question " + id;
    const revised = "CI FAQ Revised " + id;
    await signInWithClerkTesting(page, email, "admin");
    const response = await page.goto("/en/admin/faqs", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);
    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();

    await page.getByRole("button", { name: /Topics & Categories/ }).click();
    await page.getByRole("button", { name: "Add Topic" }).click();
    let modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await modal.locator('input').nth(0).fill(slug);
    await modal.locator('input').nth(1).fill(topic);
    await modal.locator('input').nth(2).fill("تصنيف اختباري في القاعدة المحلية");
    await modal.getByRole("button", { name: "Save Topic" }).click();
    await expect(modal).toBeHidden({ timeout: 20_000 });

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /Topics & Categories/ }).click();
    await expect(page.getByRole("heading", { name: topic, exact: true })).toBeVisible({ timeout: 15_000 });

    await page.getByRole("button", { name: /Questions & Answers/ }).click();
    await page.getByRole("button", { name: "Add FAQ" }).click();
    modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await modal.locator("select").selectOption({ label: topic + " (تصنيف اختباري في القاعدة المحلية)" });
    await modal.locator('input[required]').nth(0).fill(question);
    await modal.locator('input[required]').nth(1).fill("سؤال تجريبي معزول");
    await modal.locator("textarea").nth(0).fill("Synthetic FAQ answer for CI verification.");
    await modal.locator("textarea").nth(1).fill("إجابة اختبارية لتدقيق الحفظ.");
    await modal.getByRole("button", { name: "Save Question" }).click();
    await expect(modal).toBeHidden({ timeout: 20_000 });

    await page.reload({ waitUntil: "domcontentloaded" });
    let card = page.getByText(question, { exact: true }).locator(parentCard);
    await expect(card).toContainText("Synthetic FAQ answer", { timeout: 15_000 });

    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
    await card.getByRole("button", { name: "Edit" }).click();
    modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await modal.locator("textarea").nth(0).fill("Updated FAQ answer survives reload.");
    await modal.getByRole("button", { name: "Save Question" }).click();
    await expect(modal).toBeHidden({ timeout: 20_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    card = page.getByText(question, { exact: true }).locator(parentCard);
    await expect(card).toContainText("Updated FAQ answer survives reload.");

    const confirmation = await openAdminDeleteConfirmation(page, card.getByRole("button", { name: "Delete" }), "Confirm Deletion");
    await confirmation.getByRole("button", { name: "Delete" }).click();
    await expect(confirmation).toBeHidden({ timeout: 20_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByText(question, { exact: true })).toHaveCount(0);

    await page.getByRole("button", { name: /Topics & Categories/ }).click();
    const topicCard = page.getByRole("heading", { name: topic, exact: true }).locator(parentCard);
    const deleteTopic = await openAdminDeleteConfirmation(page, topicCard.getByRole("button", { name: "Delete" }), "Confirm Deletion");
    await deleteTopic.getByRole("button", { name: "Delete" }).click();
    await expect(deleteTopic).toBeHidden({ timeout: 20_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /Topics & Categories/ }).click();
    await expect(page.getByRole("heading", { name: topic, exact: true })).toHaveCount(0);
  });
});
