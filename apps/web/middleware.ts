import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Check maintenance mode
    if (process.env.MAINTENANCE_MODE === "true") {
      if (
        !req.nextUrl.pathname.startsWith("/maintenance") &&
        !req.nextUrl.pathname.startsWith("/api") &&
        !req.nextUrl.pathname.startsWith("/_next")
      ) {
        return NextResponse.redirect(new URL("/maintenance", req.url));
      }
    }

    // Force password change for authenticated users
    if (
      token?.mustChangePassword &&
      !req.nextUrl.pathname.startsWith("/auth/change-password") &&
      !req.nextUrl.pathname.startsWith("/api")
    ) {
      return NextResponse.redirect(new URL("/auth/change-password", req.url));
    }

    // Dashboard routes require LEARNER or CLIENT role
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (
        !token ||
        !["LEARNER", "CLIENT", "ADMIN"].includes(token.role as string)
      ) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public routes without token
        const publicPaths = [
          "/",
          "/formations",
          "/auth",
          "/devis-&-contact",
          "/maintenance",
          "/api",
          "/nous-rejoindre",
          "/certifications-qualite",
          "/mentions-legales",
          "/politiques-de-confidentialite",
        ];
        const isPublic = publicPaths.some(
          (path) =>
            req.nextUrl.pathname === path ||
            req.nextUrl.pathname.startsWith(path + "/")
        );

        if (isPublic) return true;

        // Protected routes need a token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets (images, fonts, etc.)
     * - Static file extensions (.png, .jpg, .svg, .ico, .webp, .woff, .woff2, .ttf)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.ico$|.*\\.webp$|.*\\.gif$|.*\\.woff$|.*\\.woff2$|.*\\.ttf$).*)",
  ],
};
