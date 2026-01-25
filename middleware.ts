import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// App is public; we only require auth for specific actions (copy embed / premium templates / styling).
export default clerkMiddleware((auth, req: NextRequest) => {
  // Skip Clerk middleware for public embed API to avoid CORS issues
  const pathname = req.nextUrl.pathname;
  
  if (pathname.startsWith("/api/public/embed/")) {
    // Let the route handler manage CORS headers
    return NextResponse.next();
  }
  
  // For all other routes, use default Clerk middleware behavior
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
