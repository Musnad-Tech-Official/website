import type { Page } from "@playwright/test";

// For disposable GitHub Actions Clerk Development accounts only.
export async function signInWithClerkTesting(page: Page, email: string, role: "admin" | "member") {
  const runId = process.env.GITHUB_RUN_ID;
  const attempt = process.env.GITHUB_RUN_ATTEMPT || "1";
  const requiredEmail = `musnad-e2e+clerk_test_${role}_${runId}_${attempt}@example.com`;
  if (!runId || !/^\d+$/.test(runId) || email !== requiredEmail) {
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
