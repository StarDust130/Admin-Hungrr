import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
// ✅ Your public route definition is correct
const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/api/imagekit-auth",
  "/terms-of-service",
  "/privacy-policy",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  const pathname = req.nextUrl.pathname;

  if (userId && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (userId && isOnboardingRoute(req)) return NextResponse.next();

  if (!userId && !isPublicRoute(req))
    return redirectToSignIn({ returnBackUrl: req.url });

  // 🚧 Force onboarding if not complete, BUT NOT for public API routes
  if (
    userId &&
    !sessionClaims?.metadata?.onboardingComplete &&
    !isPublicRoute(req) // 👈 This is the required fix
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)", // Excludes static files
    "/(api|trpc)(.*)",
  ],
};
