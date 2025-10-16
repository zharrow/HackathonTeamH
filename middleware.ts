import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { locales, defaultLocale } from "./i18n";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

const isPublicRoute = createRouteMatcher([
  "/:locale/sign-in(.*)",
  "/:locale/sign-up(.*)",
  "/:locale",
  "/",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Apply intl middleware first
  const intlResponse = intlMiddleware(req);

  // Then handle authentication
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  return intlResponse;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
