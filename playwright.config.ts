import { defineConfig, devices } from "@playwright/test";

// Remote-only test suite: never start a dev server that could inherit production credentials.
const clerkCiSetup = process.env.E2E_CLERK_DEV_AUTH === "true";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 40_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? "list" : [["list"], ["html", { open: "never" }]],
  outputDir: "test-results/e2e",
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://127.0.0.1:3000",
    trace: "off",
    screenshot: "off",
    video: "off",
    ignoreHTTPSErrors: false,
    navigationTimeout: 25_000,
  },
  projects: [
    ...(clerkCiSetup
      ? [{ name: "clerk-setup", testMatch: "**/clerk.setup.ts" }]
      : []),
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
      dependencies: clerkCiSetup ? ["clerk-setup"] : [],
    },
    {
      name: "chromium-mobile",
      use: { ...devices["Pixel 7"] },
      dependencies: clerkCiSetup ? ["clerk-setup"] : [],
    },
  ],
});
