import { test, expect, assertApplicationResponse } from "./fixtures";
import { signInWithClerkTesting } from "./clerk-test-auth";
import {
  openAdminEditor,
  openAdminDeleteConfirmation,
  requireIsolatedAdminCrd,
} from "./admin-content-helpers";

test.describe("isolated project CMS CRUD persistence", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("administrator creates, updates, and deletes a draft project in local Supabase", async ({ page }, testInfo) => {
    test.setTimeout(135_000);
    const email = process.env.E2E_ADMIN_EMAIL;
    requireIsolatedAdminCrd(email);

    const suffix = [process.env.GITHUB_RUN_ID, testInfo.project.name, testInfo.retry]
      .join("-").replace(/[^a-zA-Z0-9-]/g, "");
    const initialTitle = "CI Project " + suffix;
    const updatedTitle = "CI Revised Project " + suffix;
    const slug = "ci-project-" + suffix.toLowerCase();

    await signInWithClerkTesting(page, email, "admin");
    const response = await page.goto("/en/admin/projects", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe("/en/admin/projects");

    let editor = await openAdminEditor(
      page, page.getByRole("button", { name: "New Project" }), "Create New Project",
    );
    await editor.getByPlaceholder("e.g. Sahim Analytics Platform").fill(initialTitle);
    await editor.getByPlaceholder(
      "A concise summary of the project shown on project cards and previews...",
    ).fill("Synthetic isolated portfolio project for CI verification only.");
    await editor.getByPlaceholder("e.g. sahim-analytics").fill(slug);
    await editor.getByRole("button", { name: "العربية (AR)" }).click();
    await editor.getByPlaceholder("مثال: منصة سهم للتحليلات").fill("مشروع تجريبي للتحقق من قاعدة الاختبار");
    await editor.getByPlaceholder("نبذة موجزة عن المشروع تظهر في البطاقات والمعاينات...")
      .fill("سجل تجريبي معزول لا يمثل أعمال الشركة الفعلية.");
    await editor.locator("select").last().selectOption("draft");
    await editor.getByRole("button", { name: "Save Project" }).click();
    await expect(editor).toBeHidden({ timeout: 25_000 });

    await page.reload({ waitUntil: "domcontentloaded" });
    let row = page.locator("tbody tr").filter({ hasText: initialTitle });
    await expect(row).toHaveCount(1, { timeout: 20_000 });
    await expect(row).toContainText(slug);
    await expect(row).toContainText("Draft");

    editor = await openAdminEditor(page, row.getByTitle("Edit project"), "Edit Project");
    await expect(editor.getByPlaceholder("e.g. Sahim Analytics Platform")).toHaveValue(initialTitle);
    await expect(editor.getByPlaceholder("e.g. sahim-analytics")).toHaveValue(slug);
    await editor.getByPlaceholder("e.g. Sahim Analytics Platform").fill(updatedTitle);
    await editor.getByPlaceholder(
      "A concise summary of the project shown on project cards and previews...",
    ).fill("Revised synthetic project persisted across reloads.");
    await editor.getByRole("button", { name: "Save Project" }).click();
    await expect(editor).toBeHidden({ timeout: 25_000 });

    await page.reload({ waitUntil: "domcontentloaded" });
    row = page.locator("tbody tr").filter({ hasText: updatedTitle });
    await expect(row).toHaveCount(1, { timeout: 20_000 });
    await expect(row).toContainText("Revised synthetic project");
    await expect(page.locator("tbody tr").filter({ hasText: initialTitle })).toHaveCount(0);

    const dialog = await openAdminDeleteConfirmation(
      page, row.getByTitle("Delete project"), "Delete Project",
    );
    await dialog.getByRole("button", { name: "Delete Project" }).click();
    await expect(dialog).toBeHidden({ timeout: 25_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("tbody tr").filter({ hasText: updatedTitle })).toHaveCount(0);
    await expect(page.locator("tbody tr").filter({ hasText: slug })).toHaveCount(0);
  });
});
