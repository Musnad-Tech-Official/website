import { clerkMiddleware } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export const proxy = clerkMiddleware(async (_auth, request) => {
  const pathname = request.nextUrl.pathname;

  // Infrastructure/API endpoints are never locale-rewritten.
  if (pathname === "/api" || pathname.startsWith("/api/") || pathname.startsWith("/__clerk/")) {
    return NextResponse.next();
  }

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
