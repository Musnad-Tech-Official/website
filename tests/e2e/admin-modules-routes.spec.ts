import { test, expect, assertApplicationResponse } from "./fixtures";
import { signInWithClerkTesting } from "./clerk-test-auth";

// Every route below is a real entry in the current admin sidebar, verified
// against app/[locale]/admin/<module>/page.tsx on the isolated staging branch.
const modules = [
  "pages", "about", "careers", "faqs", "services", "projects",
  "technologies", "companies", "announcements", "testimonials",
  "articles", "comments", "inquiries", "team", "users", "settings",
] as const;

test.describe("authenticated admin module route coverage", () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  for (const locale of ["ar", "en"] as const) {
    test("real Development admin can load every sidebar module in " + locale, async ({ page }) => {
      test.setTimeout(210_000);
      const email = process.env.E2E_ADMIN_EMAIL;
      if (
        !email ||
        process.env.E2E_CLERK_DEV_AUTH !== "true" ||
        process.env.E2E_BASE_URL !== "http://localhost:3000" ||
        process.env.E2E_ISOLATED_DATABASE_CONFIRMED !== "true" ||
        process.env.E2E_STAGING_SUPABASE_URL !== "http://127.0.0.1:54321"
      ) {
        throw Error("Refusing authenticated admin module audit outside isolated Development CI.");
      }

      await signInWithClerkTesting(page, email, "admin");
      const failures: string[] = [];
      for (const moduleName of modules) {
        const path = "/" + locale + "/admin/" + moduleName;
        try {
          const response = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 25000 });
          assertApplicationResponse(page.url());
          const actualPath = new URL(page.url()).pathname.replace(/\/$/, "");
          if (response?.status() !== 200 || actualPath !== path) {
            failures.push(moduleName + ": HTTP " + (response?.status() ?? "no response") + ", final path " + actualPath);
          }
        } catch (err) {
          failures.push(moduleName + ": " + (err instanceof Error ? err.message.split("\n")[0] : "navigation failed"));
        }
      }
      expect(failures, "Admin module HTTP/path failures").toEqual([]);
    });
  }
});
