import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // If no token, let NextAuth handle redirect to signin
    if (!token) {
      return NextResponse.next();
    }

    // Only ADMIN can access admin app
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }

    // Force password change
    if (token.mustChangePassword && !req.nextUrl.pathname.startsWith("/auth/change-password")) {
      return NextResponse.redirect(new URL("/auth/change-password", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow auth pages without token
        if (req.nextUrl.pathname.startsWith("/auth")) {
          return true;
        }
        // Allow API routes to handle their own auth
        if (req.nextUrl.pathname.startsWith("/api")) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
