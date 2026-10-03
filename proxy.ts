import { clerkMiddleware } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

function checkIsAdminRoute(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return false;

  if (segments[0] === "admin") return true;

  return (
    routing.locales.includes(segments[0] as "en" | "ar") &&
    segments[1] === "admin"
  );
}

export const proxy = clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;
  const isMatchAdmin = checkIsAdminRoute(pathname);

  if (isMatchAdmin) {
    const session = await auth();

    // 1. If not logged in, redirect to Clerk sign-in with return URL
    if (!session.userId) {
      return session.redirectToSignIn({ returnBackUrl: request.url });
    }

    // 2. Check admin role in sessionClaims.metadata.role
    const role = session.sessionClaims?.metadata?.role;
    if (role !== "admin") {
      const segments = pathname.split("/").filter(Boolean);
      const locale = routing.locales.includes(segments[0] as "en" | "ar")
        ? segments[0]
        : routing.defaultLocale;
      const url = new URL(`/${locale}`, request.url);
      return NextResponse.redirect(url);
    }

    request.headers.set("x-is-admin-route", "1");
  }

  request.headers.set("x-pathname", pathname);

  return intlMiddleware(request);
});

export default proxy;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
