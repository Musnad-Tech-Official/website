import { test, expect, assertApplicationResponse } from "./fixtures";
import { signInWithClerkTesting } from "./clerk-test-auth";
import { openAdminEditor, openAdminDeleteConfirmation, requireIsolatedAdminCrd } from "./admin-content-helpers";

// Tiny valid PNG. Its bytes are generated in the test runner only and never reach production.
const testPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/gkoAAAAASUVORK5CYII=",
  "base64",
);
const imageFile = {
  name: "ci-isolated-pixel.png",
  mimeType: "image/png",
  buffer: testPng,
};

test.describe("publication and storage visibility: local Supabase only", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("draft project: Tiptap bilingual text + cover upload + public publish/unpublish", async ({ page, browser }, info) => {
    test.setTimeout(200_000);
    const email = process.env.E2E_ADMIN_EMAIL;
    requireIsolatedAdminCrd(email);
    const suffix = [process.env.GITHUB_RUN_ID, info.project.name, info.retry].join("-").replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
    const titleEn = "CI Portfolio Publication " + suffix;
    const titleAr = "مشروع تجربة نشر " + suffix;
    const bodyEn = "CI PROJECT Tiptap English " + suffix;
    const bodyAr = "نص عربي تجريبي للنشر " + suffix;
    const slug = "ci-publish-project-" + suffix;
    const publicEn = "/en/projects/" + slug;
    const publicAr = "/ar/projects/" + slug;

    await signInWithClerkTesting(page, email, "admin");
    const response = await page.goto("/en/admin/projects", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);

    let editor = await openAdminEditor(page, page.getByRole("button", { name: "New Project" }), "Create New Project");
    await editor.getByPlaceholder("e.g. Sahim Analytics Platform").fill(titleEn);
    await editor.getByPlaceholder("e.g. sahim-analytics").fill(slug);
    await editor.locator('[contenteditable="true"]').first().fill(bodyEn);
    await editor.getByRole("button", { name: "العربية (AR)" }).click();
    await editor.getByPlaceholder("مثال: منصة سهم للتحليلات").fill(titleAr);
    await editor.locator('[contenteditable="true"]').first().fill(bodyAr);
    await editor.locator('input[type="file"][accept="image/png,image/jpeg,image/webp,image/svg+xml"]').setInputFiles(imageFile);
    const coverInput = editor.getByPlaceholder("https://... cover image URL");
    await expect(coverInput).toHaveValue(/\/storage\/v1\/object\/public\/project-media\//, { timeout: 20_000 });
    const coverUrl = await coverInput.inputValue();
    expect(coverUrl).toContain("http://127.0.0.1:54321/storage/v1/object/public/project-media/");
    const imageResponse = await page.request.get(coverUrl);
    expect(imageResponse.status()).toBe(200);
    await editor.locator("select").last().selectOption("draft");
    await editor.getByRole("button", { name: "Save Project" }).click();
    await expect(editor).toBeHidden({ timeout: 25_000 });

    await page.reload({ waitUntil: "domcontentloaded" });
    let row = page.locator("tbody tr").filter({ hasText: titleEn });
    await expect(row).toHaveCount(1, { timeout: 15_000 });
    await expect(row).toContainText("Draft");
    editor = await openAdminEditor(page, row.getByTitle("Edit project"), "Edit Project");
    await expect(editor.locator('[contenteditable="true"]').first()).toContainText(bodyEn);
    await expect(editor.getByPlaceholder("https://... cover image URL")).toHaveValue(coverUrl);
    await editor.getByRole("button", { name: "العربية (AR)" }).click();
    await expect(editor.locator('[contenteditable="true"]').first()).toContainText(bodyAr);
    await editor.getByRole("button", { name: "Cancel" }).click();
    await expect(editor).toBeHidden();

    const anonymous = await browser.newContext({ baseURL: "http://localhost:3000" });
    try {
      for (const url of [publicEn, publicAr]) {
        let publicResponse = await anonymous.request.get(url);
        expect(publicResponse.status(), "Draft project must return HTTP 404: " + url).toBe(404);
        expect(await publicResponse.text()).not.toContain(bodyEn);
      }

      // Publish via existing admin UI; confirm real anonymous SSR HTML after reload.
      await row.getByRole("button", { name: "Draft" }).click();
      await expect(page.getByText("Project status updated to published", { exact: true }))
        .toBeVisible({ timeout: 15_000 });
      await expect(row.getByRole("button", { name: "Published" })).toBeVisible({ timeout: 15_000 });
      await page.reload({ waitUntil: "domcontentloaded" });
      row = page.locator("tbody tr").filter({ hasText: titleEn });
      await expect(row).toContainText("Published");
      for (const [url, title, body] of [[publicEn, titleEn, bodyEn], [publicAr, titleAr, bodyAr]]) {
        const res = await anonymous.request.get(url);
        expect(res.status(), "Published project must be available: " + url).toBe(200);
        const html = await res.text();
        expect(html).toContain(title);
        expect(html).toContain(body);
      }

      await row.getByRole("button", { name: "Published" }).click();
      await expect(page.getByText("Project status updated to draft", { exact: true }))
        .toBeVisible({ timeout: 15_000 });
      await expect(row.getByRole("button", { name: "Draft" })).toBeVisible({ timeout: 15_000 });
      await page.reload({ waitUntil: "domcontentloaded" });
      for (const url of [publicEn, publicAr]) {
        const res = await anonymous.request.get(url);
        expect(res.status(), "Unpublished project must return HTTP 404: " + url).toBe(404);
      }
    } finally {
      await anonymous.close();
    }

    row = page.locator("tbody tr").filter({ hasText: titleEn });
    const dialog = await openAdminDeleteConfirmation(page, row.getByTitle("Delete project"), "Delete Project");
    await dialog.getByRole("button", { name: "Delete Project" }).click();
    await expect(dialog).toBeHidden({ timeout: 25_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("tbody tr").filter({ hasText: slug })).toHaveCount(0);
  });

  test("draft article: Tiptap bilingual HTML + inline and cover Storage uploads + publish/unpublish", async ({ page, browser }, info) => {
    test.setTimeout(200_000);
    const email = process.env.E2E_ADMIN_EMAIL;
    requireIsolatedAdminCrd(email);
    const suffix = [process.env.GITHUB_RUN_ID, info.project.name, info.retry].join("-").replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
    const titleEn = "CI Article Publication " + suffix;
    const titleAr = "مقال تجريبي للنشر " + suffix;
    const bodyEn = "CI ARTICLE Tiptap English " + suffix;
    const bodyAr = "محتوى عربي تجريبي للمقال " + suffix;
    const slug = "ci-publish-article-" + suffix;
    const publicEn = "/en/blog/" + slug;
    const publicAr = "/ar/blog/" + slug;

    await signInWithClerkTesting(page, email, "admin");
    const response = await page.goto("/en/admin/articles", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);

    let editor = await openAdminEditor(page, page.getByRole("button", { name: "New Article" }), "Create New Article");
    await editor.getByPlaceholder("e.g. Architecting Scalable Next.js Platforms").fill(titleEn);
    await editor.getByPlaceholder("مثال: بناء منصات Next.js بمعمارية برمجية قابلة للتوسع").fill(titleAr);
    await editor.getByPlaceholder("article-slug-example").fill(slug);

    await editor.locator('[contenteditable="true"]').first().fill(bodyEn);
    await editor.getByRole("button", { name: "المحتوى العربي (RTL)" }).click();
    await editor.locator('[contenteditable="true"]').last().fill(bodyAr);
    await editor.getByRole("button", { name: "English Content (LTR)" }).click();

    // Cover and inline-image uploads must both return real public Storage URLs.
    await editor.locator('input[type="file"][accept="image/*"]').first().setInputFiles(imageFile);
    const cover = editor.getByPlaceholder("https://... or upload directly to Supabase Storage");
    await expect(cover).toHaveValue(/\/storage\/v1\/object\/public\/article-media\//, { timeout: 20_000 });
    const coverUrl = await cover.inputValue();
    expect(coverUrl).toContain("http://127.0.0.1:54321/storage/v1/object/public/article-media/");
    expect((await page.request.get(coverUrl)).status()).toBe(200);

    await editor.locator('input[type="file"][accept="image/*"]').nth(1).setInputFiles(imageFile);
    const inlineImage = editor.locator('.tiptap img[src*="/storage/v1/object/public/article-media/"]').first();
    await expect(inlineImage).toBeVisible({ timeout: 25_000 });
    const inlineUrl = await inlineImage.getAttribute("src");
    expect(inlineUrl).toContain("http://127.0.0.1:54321/storage/v1/object/public/article-media/");
    expect((await page.request.get(inlineUrl!)).status()).toBe(200);

    await editor.getByRole("button", { name: "Save as Draft" }).click();
    await expect(editor).toBeHidden({ timeout: 25_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    let row = page.locator("tbody tr").filter({ hasText: titleEn });
    await expect(row).toHaveCount(1, { timeout: 15_000 });
    await expect(row).toContainText("Draft");
    editor = await openAdminEditor(page, row.getByTitle("Edit Article"), "Edit Article");
    await expect(editor.locator('[contenteditable="true"]').first()).toContainText(bodyEn);
    await expect(editor.locator('.tiptap img[src*="/storage/v1/object/public/article-media/"]').first()).toBeVisible();
    await editor.getByRole("button", { name: "المحتوى العربي (RTL)" }).click();
    await expect(editor.locator('[contenteditable="true"]').last()).toContainText(bodyAr);
    await editor.getByRole("button", { name: "Cancel" }).click();
    await expect(editor).toBeHidden();

    const anonymous = await browser.newContext({ baseURL: "http://localhost:3000" });
    try {
      for (const url of [publicEn, publicAr]) {
        const res = await anonymous.request.get(url);
        expect(res.status(), "Draft article must return HTTP 404: " + url).toBe(404);
      }

      await row.getByRole("button", { name: "Draft" }).click();
      await expect(page.getByText("Article status updated to published", { exact: true }))
        .toBeVisible({ timeout: 15_000 });
      await expect(row.getByRole("button", { name: "Published" })).toBeVisible({ timeout: 15_000 });
      await page.reload({ waitUntil: "domcontentloaded" });
      row = page.locator("tbody tr").filter({ hasText: titleEn });
      for (const [url, title, body] of [[publicEn, titleEn, bodyEn], [publicAr, titleAr, bodyAr]]) {
        const res = await anonymous.request.get(url);
        expect(res.status(), "Published article must return HTTP 200: " + url).toBe(200);
        const html = await res.text();
        expect(html).toContain(title);
        expect(html).toContain(body);
      }

      await row.getByRole("button", { name: "Published" }).click();
      await expect(page.getByText("Article status updated to draft", { exact: true }))
        .toBeVisible({ timeout: 15_000 });
      await expect(row.getByRole("button", { name: "Draft" })).toBeVisible({ timeout: 15_000 });
      await page.reload({ waitUntil: "domcontentloaded" });
      for (const url of [publicEn, publicAr]) {
        const res = await anonymous.request.get(url);
        expect(res.status(), "Unpublished article must return HTTP 404: " + url).toBe(404);
      }
    } finally {
      await anonymous.close();
    }

    row = page.locator("tbody tr").filter({ hasText: titleEn });
    const dialog = await openAdminDeleteConfirmation(page, row.getByTitle("Delete Article"), "Delete Article");
    await dialog.getByRole("button", { name: "Delete Article" }).click();
    await expect(dialog).toBeHidden({ timeout: 25_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("tbody tr").filter({ hasText: slug })).toHaveCount(0);
  });
});
