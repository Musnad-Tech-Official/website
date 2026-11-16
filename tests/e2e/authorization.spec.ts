import { test, expect, assertApplicationResponse } from "./fixtures";
import { signInWithClerkTesting } from "./clerk-test-auth";

test.describe("anonymous administration boundary", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const locale of ["ar", "en"] as const) {
    test("anonymous visitor is redirected to sign-in " + locale, async ({ page }) => {
      await page.goto("/" + locale + "/admin", { waitUntil: "domcontentloaded" });
      assertApplicationResponse(page.url());
      await expect.poll(() => new URL(page.url()).pathname).toMatch(/sign-in/);
      expect(new URL(page.url()).pathname).not.toMatch(/\/admin(?:\/|$)/);
    });
  }
});

// Separate, disposable accounts are created only by scripts/e2e-clerk-dev-users.mjs
// against the VERIFIED Musnad Clerk DEVELOPMENT instance. Nothing is persisted
// in the repository, and no existing staff or customer accounts are used.

test.describe("authenticated DEVELOPMENT-only role boundaries", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const locale of ["ar", "en"] as const) {
    test("synthetic admin can access dashboard " + locale, async ({ page }) => {
      const email = process.env.E2E_ADMIN_EMAIL;
      if (!email && process.env.E2E_CLERK_DEV_AUTH === "true") {
        throw new Error("Missing synthetic Development administrator; refusing to skip CI auth coverage.");
      }
      test.skip(!email, "No isolated test administrator was provisioned.");
      await signInWithClerkTesting(page, email!, "admin");
      const response = await page.goto("/" + locale + "/admin", { waitUntil: "domcontentloaded" });
      assertApplicationResponse(page.url());
      expect(response?.status()).toBe(200);
      expect(new URL(page.url()).pathname).toMatch(new RegExp("/" + locale + "/admin/?$"));
    });

    test("synthetic non-admin cannot access dashboard " + locale, async ({ page }) => {
      const email = process.env.E2E_MEMBER_EMAIL;
      if (!email && process.env.E2E_CLERK_DEV_AUTH === "true") {
        throw new Error("Missing synthetic Development member; refusing to skip CI auth coverage.");
      }
      test.skip(!email, "No isolated test member was provisioned.");
      await signInWithClerkTesting(page, email!, "member");
      const response = await page.goto("/" + locale + "/admin", { waitUntil: "domcontentloaded" });
      assertApplicationResponse(page.url());
      const path = new URL(page.url()).pathname;
      // An anonymous visitor is redirected to /sign-in, not to the
      // localized home. Do not count an unauthenticated redirect as denial.
      expect(path).not.toMatch(/\/sign-in(?:\/|$)/);
      expect(response?.status() === 404 || path === "/" + locale || path === "/" + locale + "/").toBe(true);
    });
  }
});
