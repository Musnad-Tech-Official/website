import { test, expect, assertApplicationResponse } from "./fixtures";
import { signInWithClerkTesting } from "./clerk-test-auth";
import { requireIsolatedAdminCrd, openAdminDeleteConfirmation, openAdminEditor } from "./admin-content-helpers";

test.describe("isolated contact, moderation and settings workflows", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("anonymous contact inquiry persists; admin updates status/notes and deletes it", async ({ page, browser }, info) => {
    test.setTimeout(130_000);
    const adminEmail = process.env.E2E_ADMIN_EMAIL;
    requireIsolatedAdminCrd(adminEmail);
    const suffix = [process.env.GITHUB_RUN_ID, info.project.name, info.retry].join("-").replace(/[^a-zA-Z0-9-]/g, "");
    const clientName = "CI Inquiry " + suffix;
    const clientEmail = "ci-inquiry-" + suffix.toLowerCase() + "@example.com";
    const message = "Isolated inquiry submitted by actual public contact form.";
    const adminNote = "CI review note " + suffix;

    const guest = await browser.newContext({ baseURL: "http://localhost:3000" });
    try {
      const publicPage = await guest.newPage();
      const res = await publicPage.goto("/en/contact", { waitUntil: "domcontentloaded" });
      expect(res?.status()).toBe(200);
      await expect(publicPage.locator('[data-contact-hydrated="true"]')).toBeVisible({ timeout: 20_000 });
      await publicPage.locator("#contact-name").fill(clientName);
      await publicPage.locator("#contact-email").fill(clientEmail);
      await publicPage.locator("#contact-message").fill(message);
      await publicPage.locator('form button[type="submit"]').click();
      await expect(publicPage.getByText("Ref ID:")).toBeVisible({ timeout: 20_000 });
    } finally {
      await guest.close();
    }

    await signInWithClerkTesting(page, adminEmail, "admin");
    const response = await page.goto("/en/admin/inquiries", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);
    let card = page.getByRole("heading", { name: clientName, exact: true })
      .locator("xpath=ancestor::div[contains(@class,'flex-col') and contains(@class,'justify-between')][1]");
    await expect(card).toContainText(message, { timeout: 18_000 });
    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();

    await card.getByRole("button", { name: "View Details" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.locator("select").selectOption("in_review");
    await dialog.getByPlaceholder("Notes on discovery call, assigned engineer, or proposal...").fill(adminNote);
    await dialog.getByRole("button", { name: "Save Changes" }).click();
    await expect(dialog).toBeHidden({ timeout: 20_000 });

    await page.reload({ waitUntil: "domcontentloaded" });
    card = page.getByRole("heading", { name: clientName, exact: true })
      .locator("xpath=ancestor::div[contains(@class,'flex-col') and contains(@class,'justify-between')][1]");
    await expect(card).toContainText(adminNote, { timeout: 15_000 });
    const confirmation = await openAdminDeleteConfirmation(
      page, card.getByRole("button").last(), "Delete Client Inquiry",
    );
    await confirmation.getByRole("button", { name: "Delete" }).click();
    await expect(confirmation).toBeHidden({ timeout: 20_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: clientName, exact: true })).toHaveCount(0);
  });

  test("real member comment survives reload, admin moderation toggles public visibility, then deletes", async ({ page, browser }, info) => {
    test.setTimeout(190_000);
    const adminEmail = process.env.E2E_ADMIN_EMAIL;
    const memberEmail = process.env.E2E_MEMBER_EMAIL;
    requireIsolatedAdminCrd(adminEmail);
    requireIsolatedAdminCrd(memberEmail);
    const suffix = [process.env.GITHUB_RUN_ID, info.project.name, info.retry].join("-").replace(/[^a-zA-Z0-9-]/g, "");
    const title = "CI Comments Article " + suffix;
    const slug = "ci-comments-" + suffix.toLowerCase();
    const comment = "CI persistent member comment " + suffix;

    await signInWithClerkTesting(page, adminEmail, "admin");
    let response = await page.goto("/en/admin/articles", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);
    const editor = await openAdminEditor(page, page.getByRole("button", { name: "New Article" }), "Create New Article");
    await editor.getByPlaceholder("e.g. Architecting Scalable Next.js Platforms").fill(title);
    await editor.getByPlaceholder("مثال: بناء منصات Next.js بمعمارية برمجية قابلة للتوسع").fill("مقال تعليقات تجريبي");
    await editor.getByPlaceholder("article-slug-example").fill(slug);
    await editor.getByRole("button", { name: "Publish Article" }).click();
    await expect(editor).toBeHidden({ timeout: 20_000 });

    const member = await browser.newContext({ baseURL: "http://localhost:3000" });
    const guest = await browser.newContext({ baseURL: "http://localhost:3000" });
    try {
      const memberPage = await member.newPage();
      await signInWithClerkTesting(memberPage, memberEmail, "member");
      const memberResponse = await memberPage.goto("/en/blog/" + slug, { waitUntil: "domcontentloaded" });
      expect(memberResponse?.status()).toBe(200);
      const commentArea = memberPage.locator('section[aria-labelledby="comments-heading"]');
      await expect(commentArea.locator('textarea[required]')).toBeVisible({ timeout: 15_000 });
      // A server-rendered textarea can be visible before React attaches onSubmit.
      await expect(commentArea).toHaveAttribute("data-comments-hydrated", "true", { timeout: 15_000 });
      const input = commentArea.locator('textarea[required]');
      await input.fill(comment);
      await commentArea.locator('form button[type="submit"]').first().click();
      // An unchanged textarea can match getByText even when posting failed.
      // The form clears only on a confirmed successful server action.
      await expect.poll(async () => {
        if ((await input.inputValue()) === "") return "submitted";
        const errors = await commentArea.locator("p.text-destructive").allTextContents();
        return errors.join(" | ") || "posting-or-failed";
      }, { timeout: 20_000, message: "Member comment must be saved before clearing the editor" }).toBe("submitted");
      await expect(commentArea.getByText(comment, { exact: true })).toBeVisible({ timeout: 20_000 });
      // A client cache update is not proof that the database committed.
      await memberPage.reload({ waitUntil: "domcontentloaded" });
      await expect(memberPage.getByText(comment, { exact: true })).toBeVisible({ timeout: 20_000 });

      // Independently prove durability and public RLS with the local PostgREST API,
      // not just the post-submit client cache. Never use a remote database.
      const localAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (!localAnonKey) throw Error("No local Supabase public test key.");
      const stored = await page.request.get(
        "http://127.0.0.1:54321/rest/v1/article_comments?article_slug=eq." +
        encodeURIComponent(slug) + "&select=id,content,status",
        { headers: { apikey: localAnonKey, Authorization: "Bearer " + localAnonKey } },
      );
      expect(stored.status(), "Local approved comments must be readable via RLS").toBe(200);
      const rows = (await stored.json()) as Array<{ content: string; status: string }>;
      expect(rows.filter((row) => row.content === comment && row.status === "approved")).toHaveLength(1);

      await page.goto("/en/admin/comments", { waitUntil: "domcontentloaded" });
      let commentCard = page.getByText(comment, { exact: true })
        .locator("xpath=ancestor::div[contains(@class,'flex-col') and contains(@class,'sm:flex-row')][1]");
      await expect(commentCard).toBeVisible({ timeout: 15_000 });
      await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
      await commentCard.getByRole("button", { name: "Flag" }).click();
      await expect(commentCard).toContainText("Flagged", { timeout: 15_000 });
      await page.reload({ waitUntil: "domcontentloaded" });
      commentCard = page.getByText(comment, { exact: true })
        .locator("xpath=ancestor::div[contains(@class,'flex-col') and contains(@class,'sm:flex-row')][1]");
      await expect(commentCard).toContainText("Flagged");

      let guestHtml = await (await guest.request.get("/en/blog/" + slug)).text();
      expect(guestHtml).not.toContain(comment);

      await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
      await commentCard.getByRole("button", { name: "Approve" }).click();
      await expect(commentCard).toContainText("Approved", { timeout: 15_000 });
      await page.reload({ waitUntil: "domcontentloaded" });
      commentCard = page.getByText(comment, { exact: true })
        .locator("xpath=ancestor::div[contains(@class,'flex-col') and contains(@class,'sm:flex-row')][1]");
      await expect(commentCard).toContainText("Approved");
      guestHtml = await (await guest.request.get("/en/blog/" + slug)).text();
      expect(guestHtml).toContain(comment);

      const confirm = await openAdminDeleteConfirmation(
        page, commentCard.getByRole("button", { name: "Delete" }), "Delete Comment",
      );
      await confirm.getByRole("button", { name: "Delete" }).click();
      await expect(confirm).toBeHidden({ timeout: 20_000 });
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(page.getByText(comment, { exact: true })).toHaveCount(0);
    } finally {
      await member.close();
      await guest.close();
    }

    await page.goto("/en/admin/articles", { waitUntil: "domcontentloaded" });
    const row = page.locator("tbody tr").filter({ hasText: title });
    await expect(row).toHaveCount(1);
    const confirmArticle = await openAdminDeleteConfirmation(page, row.getByTitle("Delete Article"), "Delete Article");
    await confirmArticle.getByRole("button", { name: "Delete Article" }).click();
    await expect(confirmArticle).toBeHidden({ timeout: 20_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("tbody tr").filter({ hasText: title })).toHaveCount(0);
  });

  test("admin system telemetry refresh and local cache purge return real successful response", async ({ page }) => {
    test.setTimeout(85_000);
    const adminEmail = process.env.E2E_ADMIN_EMAIL;
    requireIsolatedAdminCrd(adminEmail);
    await signInWithClerkTesting(page, adminEmail, "admin");
    const response = await page.goto("/en/admin/settings", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);
    await expect(page.locator('[data-admin-hydrated="true"]')).toBeVisible();
    await page.getByRole("button", { name: "Refresh" }).click();
    await expect(page.getByText("System diagnostics refreshed successfully.")).toBeVisible({ timeout: 20_000 });
    await page.getByRole("button", { name: "Purge All Cache" }).click();
    await expect(page.getByText(/Global page cache purged and ISR revalidation triggered/)).toBeVisible({ timeout: 20_000 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "System Settings & Diagnostics" })).toBeVisible();
  });
});
