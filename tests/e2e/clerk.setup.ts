import { test as setup } from "@playwright/test";

// Only the isolated GitHub Actions run creates Clerk development test users.
// Official Clerk testing setup provisions a short-lived testing token.
setup("Clerk Development Playwright bootstrap", async () => {
  if (
    process.env.E2E_CLERK_DEV_AUTH !== "true" ||
    process.env.E2E_BASE_URL !== "http://localhost:3000" ||
    process.env.E2E_ISOLATED_DATABASE_CONFIRMED !== "true" ||
    process.env.E2E_STAGING_SUPABASE_URL !== "http://127.0.0.1:54321" ||
    !process.env.CLERK_SECRET_KEY?.startsWith("sk_test_") ||
    process.env.CLERK_PUBLISHABLE_KEY !==
      "pk_test_dmlhYmxlLW1vdGgtMTgxNC5jbGVyay5hY2NvdW50cy5kZXYk"
  ) {
    throw new Error("Refusing Clerk setup outside isolated Development CI.");
  }

  // Installed in CI at an exact version; never introduced into runtime deps.
  const clerkPackage = "@clerk/testing/playwright";
  const { clerkSetup } = await import(clerkPackage);
  await clerkSetup();
});
