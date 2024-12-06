// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Redirect root to login
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Public paths that don't require authentication
        const publicPaths = ["/login"];
        if (publicPaths.includes(req.nextUrl.pathname)) {
          return true;
        }
        // All other paths require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
