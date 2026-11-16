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
async function loginWithDevelopmentTestCode(page: Page, email: string) {
  if (!/^musnad-e2e\+clerk_test_(admin|member)_\d+_\d+@example\.com$/.test(email)) {
    throw Error("Refusing to sign in with anything except this run's synthetic Clerk test address.");
  }
  await page.goto("/en/sign-in", { waitUntil: "domcontentloaded" });
  await page.locator('input[name="identifier"]').fill(email);
  await page.getByRole("button", { name: /continue/i }).click();

  // Clerk Development test emails never send messages and accept the fixed
  // verification code documented in Clerk's testing guidance.
  // Clerk's OTP widgets are not guaranteed to expose input[name="code"].
  // Prefer Clerk's documented accessible name, then standard OTP attributes.
  const otp = page.getByRole("textbox", { name: /enter verification code/i })
    .or(page.locator('input[autocomplete="one-time-code"]'))
    .or(page.locator('input[inputmode="numeric"]'))
    .first();
  try {
    await expect(otp).toBeVisible({ timeout: 12_000 });
  } catch (error) {
    const form = await page.evaluate(() => ({
      path: location.pathname,
      inputs: Array.from(document.querySelectorAll("input")).map((input) => ({
        name: input.name,
        type: input.type,
        autocomplete: input.autocomplete,
        inputMode: input.inputMode,
        placeholder: input.placeholder,
      })),
      buttonCount: document.querySelectorAll("button").length,
      otpWidgetCount: document.querySelectorAll('[data-otp-input], [data-input-otp]').length,
    }));
    console.error("Sanitized Clerk test form structure:", JSON.stringify(form));
    throw error;
  }
  await otp.pressSequentially("424242");
  // Clerk's OTP UI auto-submits; a page-global Clerk object is not
  // guaranteed by @clerk/nextjs. Require navigation out of sign-in and
  // prove authorization against the server-side /admin boundary below.
  await expect.poll(
    () => new URL(page.url()).pathname,
    { timeout: 20_000 }
  ).toMatch(/^\/(?:en|ar)\/?$/);
}

test.describe("authenticated DEVELOPMENT-only role boundaries", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const locale of ["ar", "en"] as const) {
    test("synthetic admin can access dashboard " + locale, async ({ page }) => {
      const email = process.env.E2E_ADMIN_EMAIL;
      test.skip(!email, "No verified temporary Clerk Development administrator was created.");
      await loginWithDevelopmentTestCode(page, email!);
      const response = await page.goto("/" + locale + "/admin", { waitUntil: "domcontentloaded" });
      assertApplicationResponse(page.url());
      expect(response?.status()).toBe(200);
      expect(new URL(page.url()).pathname).toMatch(new RegExp("/" + locale + "/admin/?$"));
    });

    test("synthetic non-admin cannot access dashboard " + locale, async ({ page }) => {
      const email = process.env.E2E_MEMBER_EMAIL;
      test.skip(!email, "No verified temporary Clerk Development member was created.");
      await loginWithDevelopmentTestCode(page, email!);
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
