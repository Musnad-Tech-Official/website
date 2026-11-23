import { test as base, expect } from "@playwright/test";

// Only the staging origin receives a short-lived Vercel trusted-sources token.
export const test = base.extend<{ previewAccess: void }>({
  previewAccess: [
    async ({ context }, use) => {
      const token = process.env.E2E_VERCEL_OIDC_TOKEN;
      const target = process.env.E2E_BASE_URL;
      if (token && target) {
        const origin = new URL(target).origin;
        await context.route("**/*", async (route) => {
          let sameOrigin = false;
          try {
            sameOrigin = new URL(route.request().url()).origin === origin;
          } catch {
            // Non-HTTP URLs do not receive the token.
          }
          if (!sameOrigin) return route.continue();
          return route.continue({
            headers: {
              ...route.request().headers(),
              "x-vercel-trusted-oidc-idp-token": token,
            },
          });
        });
      }
      await use();
    },
    { auto: true },
  ],
});

export { expect };

export function assertApplicationResponse(url: string): void {
  const hostname = new URL(url).hostname;
  if (hostname === "vercel.com" || hostname.endsWith(".vercel.com")) {
    throw new Error("Vercel SSO was shown instead of the app; approved Preview access is required.");
  }
}
