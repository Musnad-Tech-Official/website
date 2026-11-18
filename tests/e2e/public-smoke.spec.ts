import { test, expect, assertApplicationResponse } from "./fixtures";

const locales = ["ar", "en"] as const;
const routes = ["/", "/services", "/contact", "/careers"] as const;

for (const locale of locales) {
  for (const path of routes) {
    test("localized " + locale + path + " loads", async ({ page }) => {
      const url = "/" + locale + (path === "/" ? "" : path);
      const response = await page.goto(url, { waitUntil: "domcontentloaded" });
      expect(response).not.toBeNull();
      assertApplicationResponse(page.url());
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page).toHaveTitle(/.+/);
      await expect(page.locator("body")).not.toBeEmpty();
    });
  }
  test("localized sign-in shell " + locale, async ({ page }) => {
    const response = await page.goto("/" + locale + "/sign-in", { waitUntil: "domcontentloaded" });
    assertApplicationResponse(page.url());
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
  });
}

test("unknown localized route returns 404", async ({ page }) => {
  const response = await page.goto("/ar/__musnad_e2e_missing_route__", { waitUntil: "domcontentloaded" });
  assertApplicationResponse(page.url());
  expect(response?.status()).toBe(404);
});
