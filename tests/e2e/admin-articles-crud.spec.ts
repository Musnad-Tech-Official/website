import { test, expect, assertApplicationResponse } from "./fixtures";
import { signInWithClerkTesting } from "./clerk-test-auth";
import {
  openAdminEditor,
  openAdminDeleteConfirmation,
  requireIsolatedAdminCrd,
} from "./admin-content-helpers";

test.describe("isolated article CMS CRUD persistence", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("administrator creates, updates, and deletes a draft article in local Supabase", async ({ page }, testInfo) => {
    test.setTimeout(135_000);
    const email = process.env.E2E_ADMIN_EMAIL;
    requireIsolatedAdminCrd(email);

    const suffix = [process.env.GITHUB_RUN_ID, testInfo.project.name, testInfo.retry]
      .join("-").replace(/[^a-zA-Z0-9-]/g, "");
    const initialTitle = "CI Article " + suffix;
    const updatedTitle = "CI Revised Article " + suffix;
    const slug = "ci-article-" + suffix.toLowerCase();

    await signInWithClerkTesting(page, email, "admin");
    const response = await page.goto("/en/admin/articles", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe("/en/admin/articles");

    let editor = await openAdminEditor(
      page, page.getByRole("button", { name: "New Article" }), "Create New Article",
    );
    await editor.getByPlaceholder("e.g. Architecting Scalable Next.js Platforms").fill(initialTitle);
    await editor.getByPlaceholder("مثال: بناء منصات Next.js بمعمارية برمجية قابلة للتوسع")
      .fill("مقال اختباري معزول للتحقق من الحفظ");
    await editor.getByPlaceholder("article-slug-example").fill(slug);
    await editor.getByPlaceholder("Brief summary of the article...")
      .fill("Synthetic draft article for isolated CI storage verification.");
    await editor.getByPlaceholder("نبذة موجزة عن محتوى المقال...")
      .fill("هذا نص اختباري غير حقيقي ولا ينشر على الموقع.");
    await editor.getByRole("button", { name: "Save as Draft" }).click();
    await expect(editor).toBeHidden({ timeout: 25_000 });

    await page.reload({ waitUntil: "domcontentloaded" });
    let row = page.locator("tbody tr").filter({ hasText: initialTitle });
    await expect(row).toHaveCount(1, { timeout: 20_000 });
    await expect(row).toContainText(slug);
    await expect(row).toContainText("Draft");

    editor = await openAdminEditor(page, row.getByTitle("Edit Article"), "Edit Article");
    await expect(editor.getByPlaceholder("e.g. Architecting Scalable Next.js Platforms"))
      .toHaveValue(initialTitle);
    await expect(editor.getByPlaceholder("Brief summary of the article..."))
      .toHaveValue("Synthetic draft article for isolated CI storage verification.");
    await editor.getByPlaceholder("e.g. Architecting Scalable Next.js Platforms").fill(updatedTitle);
    await editor.getByPlaceholder("Brief summary of the article...")
      .fill("Revised synthetic article saved to local Supabase.");
    await editor.getByRole("button", { name: "Save as Draft" }).click();
    await expect(editor).toBeHidden({ timeout: 25_000 });

    await page.reload({ waitUntil: "domcontentloaded" });
    row = page.locator("tbody tr").filter({ hasText: updatedTitle });
    await expect(row).toHaveCount(1, { timeout: 20_000 });
    await expect(row).toContainText(slug);
    await expect(row).toContainText("Draft");
    await expect(page.locator("tbody tr").filter({ hasText: initialTitle })).toHaveCount(0);

    editor = await openAdminEditor(page, row.getByTitle("Edit Article"), "Edit Article");
    await expect(editor.getByPlaceholder("Brief summary of the article..."))
      .toHaveValue("Revised synthetic article saved to local Supabase.");
    await editor.getByRole("button", { name: "Cancel" }).click();
    await expect(editor).toBeHidden({ timeout: 10_000 });

    const dialog = await openAdminDeleteConfirmation(
      page, row.getByTitle("Delete Article"), "Delete Article",
    );
    await dialog.getByRole("button", { name: "Delete Article" }).click();
    await expect(dialog).toBeHidden({ timeout: 25_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("tbody tr").filter({ hasText: updatedTitle })).toHaveCount(0);
    await expect(page.locator("tbody tr").filter({ hasText: slug })).toHaveCount(0);
  });
});
