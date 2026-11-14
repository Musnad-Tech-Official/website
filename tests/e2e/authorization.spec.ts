import { test, expect, assertApplicationResponse } from "./fixtures";
import { existsSync } from "node:fs";

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

test.describe("authenticated staging administrator", () => {
  const state = process.env.E2E_ADMIN_STORAGE_STATE;
  test.use({ storageState: state || { cookies: [], origins: [] } });

  test("real admin can load the dashboard", async ({ page }) => {
    test.skip(!state || !existsSync(state), "Staging admin session absent; live auth not verified.");
    const response = await page.goto("/en/admin", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toMatch(/\/en\/admin\/?$/);
  });
});

test.describe("authenticated staging non-admin", () => {
  const state = process.env.E2E_MEMBER_STORAGE_STATE;
  test.use({ storageState: state || { cookies: [], origins: [] } });

  test("member is denied dashboard access", async ({ page }) => {
    test.skip(!state || !existsSync(state), "Staging member session absent; role denial not verified.");
    const response = await page.goto("/en/admin", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    const path = new URL(page.url()).pathname;
    expect(response?.status() === 404 || !/\/admin(?:\/|$)/.test(path)).toBe(true);
  });
});
