import { test, expect, assertApplicationResponse } from "./fixtures";
import type { Page } from "@playwright/test";

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
async function signInWithClerkTesting(page: Page, email: string, role: "admin" | "member") {
  const runId = process.env.GITHUB_RUN_ID;
  const attempt = process.env.GITHUB_RUN_ATTEMPT || "1";
  const requiredEmail = `musnad-e2e+clerk_test_${role}_${runId}_${attempt}@example.com`;
  if (!runId || !/^\\d+$/.test(runId) || email !== requiredEmail) {
    throw new Error("Only the current GitHub Actions run's synthetic account is allowed.");
  }
  if (
    !process.env.CLERK_SECRET_KEY?.startsWith("sk_test_") ||
    process.env.E2E_CLERK_DEV_AUTH !== "true" ||
    process.env.E2E_BASE_URL !== "http://localhost:3000" ||
    process.env.E2E_ISOLATED_DATABASE_CONFIRMED !== "true" ||
    process.env.E2E_STAGING_SUPABASE_URL !== "http://127.0.0.1:54321" ||
    process.env.CLERK_PUBLISHABLE_KEY !==
      "pk_test_dmlhYmxlLW1vdGgtMTgxNC5jbGVyay5hY2NvdW50cy5kZXYk"
  ) {
    throw new Error("Clerk authenticated E2E is restricted to isolated Development CI.");
  }

  // Clerk's official helper signs in a test email via its Backend API.
  // It also adds a testing token, avoiding first-factor UI and bot challenges.
  // CI installs the pinned helper without changing production dependencies.
  const clerkPackage = "@clerk/testing/playwright";
  const { clerk } = await import(clerkPackage);
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await clerk.signIn({
    page,
    emailAddress: email,
    setupClerkTestingTokenOptions: {
      frontendApiUrl: "viable-moth-1814.clerk.accounts.dev",
    },
  });
}

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
