import { expect, test } from "@playwright/test";

for (const locale of ["en", "ar"] as const) {
  test(`${locale} public home responds`, async ({ page }) => {
    const response = await page.goto(`/${locale}`);

    expect(response?.ok()).toBe(true);
    await expect(page.locator("body")).toBeVisible();
  });
}

test("unsigned Clerk webhook is rejected at the unlocalized API path", async ({ request }) => {
  const response = await request.post("/api/webhooks/clerk", {
    data: { type: "user.created" },
  });

  expect(response.status()).toBe(400);
  expect(await response.text()).toBe("Invalid webhook signature");
});
